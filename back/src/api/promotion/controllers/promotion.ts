import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::promotion.promotion', ({ strapi }) => ({
  async calculateDiscounts(ctx) {
    try {
      const { cartItems } = ctx.request.body;
      
      if (!cartItems || !Array.isArray(cartItems)) {
        return ctx.badRequest('cartItems est requis et doit être un tableau');
      }

      const activePromotions = await strapi.db.query('api::promotion.promotion').findMany({
        where: {
          isActive: true
        },
        populate: ['products', 'categories'],
        orderBy: { priority: 'desc' }
      });

      const appliedDiscounts = [];

      const itemsByProduct = {};
      cartItems.forEach((item: any) => {
        const productId = item.productId;
        if (!itemsByProduct[productId]) {
          itemsByProduct[productId] = [];
        }
        itemsByProduct[productId].push(item);
      });

      for (const [productId, items] of Object.entries(itemsByProduct)) {
        const totalQuantity = (items as any[]).reduce((sum: number, item: any) => sum + item.quantity, 0);
        const product = await strapi.db.query('api::product.product').findOne({
          where: { id: productId },
          populate: ['category']
        });
        
        const applicablePromotions = (activePromotions as any[]).filter((promotion: any) => {
          const appliesToProduct = promotion.products?.some((p: any) => p.id === parseInt(productId)) ||
                                  promotion.categories?.some((c: any) => c.id === (product as any).category?.id);
          
          return appliesToProduct && totalQuantity >= promotion.buyQuantity;
        });

        if (applicablePromotions.length > 0) {
          const bestPromotion = applicablePromotions[0];
          const discount = calculatePromotionDiscount(bestPromotion, totalQuantity, product);
          
          if (discount.amount > 0) {
            appliedDiscounts.push({
              promotionId: bestPromotion.id,
              promotionName: bestPromotion.name,
              displayMessage: bestPromotion.displayMessage,
              productId: parseInt(productId),
              discountAmount: discount.amount,
              originalPrice: discount.originalPrice,
              finalPrice: discount.finalPrice,
              quantityDiscounted: discount.quantityDiscounted
            });
          }
        }
      }

      return {
        appliedDiscounts,
        totalDiscount: appliedDiscounts.reduce((sum: number, discount: any) => sum + discount.discountAmount, 0)
      };

    } catch (error) {
      return ctx.internalServerError('Erreur lors du calcul des réductions', { error: (error as Error).message });
    }
  },

  async getProductPromotions(ctx) {
    try {
      const { productId } = ctx.params;
      
      const promotions = await strapi.db.query('api::promotion.promotion').findMany({
        where: {
          isActive: true
        },
        populate: ['products', 'categories'],
        orderBy: { priority: 'desc' }
      });

      const product = await strapi.db.query('api::product.product').findOne({
        where: { id: productId },
        populate: ['category']
      });

      const applicablePromotions = (promotions as any[]).filter((promotion: any) => {
        return promotion.products?.some((p: any) => p.id === parseInt(productId)) ||
               promotion.categories?.some((c: any) => c.id === (product as any).category?.id);
      });

      return applicablePromotions;

    } catch (error) {
      return ctx.internalServerError('Erreur lors de la récupération des promotions', { error: (error as Error).message });
    }
  }
}));

const calculatePromotionDiscount = (promotion: any, totalQuantity: number, product: any) => {
  const unitPrice = parseFloat(product.price);
  const originalPrice = totalQuantity * unitPrice;

  switch (promotion.promotionType) {
    case 'buy_x_get_y_free':
      return calculateBuyXGetYFree(promotion, totalQuantity, unitPrice, originalPrice);
    
    case 'bulk_discount':
      return calculateBulkDiscount(promotion, totalQuantity, unitPrice, originalPrice);
    
    case 'fixed_price_bundle':
      return calculateFixedPriceBundle(promotion, totalQuantity, unitPrice, originalPrice);
    
    case 'percentage_discount':
      return calculatePercentageDiscount(promotion, totalQuantity, unitPrice, originalPrice);
    
    default:
      return { amount: 0, originalPrice, finalPrice: originalPrice, quantityDiscounted: 0 };
  }
};

const calculateBuyXGetYFree = (promotion: any, totalQuantity: number, unitPrice: number, originalPrice: number) => {
  const buyQuantity = promotion.buyQuantity;
  const getQuantity = promotion.getQuantity || 0;
  const bundleSize = buyQuantity + getQuantity;
  
  const bundles = Math.floor(totalQuantity / bundleSize);
  const remainingItems = totalQuantity % bundleSize;
  
  const discountedQuantity = bundles * getQuantity;
  const paidQuantity = bundles * buyQuantity + Math.min(remainingItems, buyQuantity);
  
  const finalPrice = paidQuantity * unitPrice;
  const discountAmount = originalPrice - finalPrice;
  
  return {
    amount: discountAmount,
    originalPrice,
    finalPrice,
    quantityDiscounted: discountedQuantity
  };
};

const calculateBulkDiscount = (promotion: any, totalQuantity: number, unitPrice: number, originalPrice: number) => {
  const discountPercentage = promotion.discountPercentage || 0;
  const discountMultiplier = (100 - discountPercentage) / 100;
  
  const finalPrice = originalPrice * discountMultiplier;
  const discountAmount = originalPrice - finalPrice;
  
  return {
    amount: discountAmount,
    originalPrice,
    finalPrice,
    quantityDiscounted: totalQuantity
  };
};

const calculateFixedPriceBundle = (promotion: any, totalQuantity: number, unitPrice: number, originalPrice: number) => {
  const bundlePrice = parseFloat(promotion.bundlePrice);
  const buyQuantity = promotion.buyQuantity;
  
  const bundles = Math.floor(totalQuantity / buyQuantity);
  const remainingItems = totalQuantity % buyQuantity;
  
  const bundleCost = bundles * bundlePrice;
  const remainingCost = remainingItems * unitPrice;
  const finalPrice = bundleCost + remainingCost;
  const discountAmount = originalPrice - finalPrice;
  
  return {
    amount: discountAmount,
    originalPrice,
    finalPrice,
    quantityDiscounted: bundles * buyQuantity
  };
};

const calculatePercentageDiscount = (promotion: any, totalQuantity: number, unitPrice: number, originalPrice: number) => {
  const discountPercentage = promotion.discountPercentage || 0;
  const discountMultiplier = (100 - discountPercentage) / 100;
  
  const finalPrice = originalPrice * discountMultiplier;
  const discountAmount = originalPrice - finalPrice;
  
  return {
    amount: discountAmount,
    originalPrice,
    finalPrice,
    quantityDiscounted: totalQuantity
  };
}; 
import { getRequest, postRequest } from "../../lib/strapi";

export interface Promotion {
  id: number;
  name: string;
  description: string;
  promotionType: 'buy_x_get_y_free' | 'bulk_discount' | 'percentage_discount' | 'fixed_price_bundle';
  isActive: boolean;
  buyQuantity: number;
  getQuantity?: number;
  discountPercentage?: number;
  bundlePrice?: number;
  displayMessage: string;
  priority: number;
  products?: any[];
  categories?: any[];
}

export interface CartItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface AppliedDiscount {
  promotionId: number;
  promotionName: string;
  displayMessage: string;
  productId: number;
  discountAmount: number;
  originalPrice: number;
  finalPrice: number;
  quantityDiscounted: number;
}

export interface DiscountCalculation {
  appliedDiscounts: AppliedDiscount[];
  totalDiscount: number;
}

export async function fetchProductPromotions(productId: number): Promise<Promotion[]> {
  try {
    const data = await getRequest(`promotions/product/${productId}`);
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des promotions:', error);
    return [];
  }
}

export async function calculateCartDiscounts(cartItems: CartItem[]): Promise<DiscountCalculation> {
  try {
    const data = await postRequest('promotions/calculate-discounts', {
      cartItems
    });
    return data || { appliedDiscounts: [], totalDiscount: 0 };
  } catch (error) {
    console.error('Erreur lors du calcul des réductions:', error);
    return { appliedDiscounts: [], totalDiscount: 0 };
  }
}

export function formatPromotionMessage(promotion: Promotion): string {
  switch (promotion.promotionType) {
    case 'buy_x_get_y_free':
      return `${promotion.buyQuantity} acheté${promotion.buyQuantity > 1 ? 's' : ''} = ${promotion.getQuantity} offert${promotion.getQuantity && promotion.getQuantity > 1 ? 's' : ''}`;
    
    case 'fixed_price_bundle':
      return `${promotion.buyQuantity} acheté${promotion.buyQuantity > 1 ? 's' : ''} = le lot à ${promotion.bundlePrice}€`;
    
    case 'bulk_discount':
      return `${promotion.buyQuantity} acheté${promotion.buyQuantity > 1 ? 's' : ''} = ${promotion.discountPercentage}% de réduction`;
    
    case 'percentage_discount':
      return `${promotion.discountPercentage}% de réduction`;
    
    default:
      return promotion.displayMessage || promotion.name;
  }
}

export function isPromotionApplicable(promotion: Promotion, quantity: number): boolean {
  return quantity >= promotion.buyQuantity;
}

export function calculatePromotionSavings(promotion: Promotion, quantity: number, unitPrice: number): number {
  const originalPrice = quantity * unitPrice;
  
  switch (promotion.promotionType) {
    case 'buy_x_get_y_free': {
      const buyQuantity = promotion.buyQuantity;
      const getQuantity = promotion.getQuantity || 0;
      const bundleSize = buyQuantity + getQuantity;
      const bundles = Math.floor(quantity / bundleSize);
      const remainingItems = quantity % bundleSize;
      const discountedQuantity = bundles * getQuantity;
      const paidQuantity = bundles * buyQuantity + Math.min(remainingItems, buyQuantity);
      const finalPrice = paidQuantity * unitPrice;
      return originalPrice - finalPrice;
    }
    
    case 'fixed_price_bundle': {
      const bundlePrice = promotion.bundlePrice || 0;
      const buyQty = promotion.buyQuantity;
      const bundles = Math.floor(quantity / buyQty);
      const remaining = quantity % buyQty;
      const bundleCost = bundles * bundlePrice;
      const remainingCost = remaining * unitPrice;
      const finalPrice2 = bundleCost + remainingCost;
      return originalPrice - finalPrice2;
    }
    
    case 'bulk_discount':
    case 'percentage_discount': {
      const discountPercentage = promotion.discountPercentage || 0;
      const discountMultiplier = (100 - discountPercentage) / 100;
      const finalPrice3 = originalPrice * discountMultiplier;
      return originalPrice - finalPrice3;
    }
    
    default:
      return 0;
  }
} 
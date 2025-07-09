/**
 * shipping-type service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::shipping-type.shipping-type', ({ strapi }) => ({
  async getActiveShippingTypes() {
    return await strapi.entityService.findMany('api::shipping-type.shipping-type', {
      filters: {
        isActive: true,
        publishedAt: { $notNull: true }
      },
      sort: { priority: 'asc', name: 'asc' },
      populate: '*'
    });
  },

  async calculateFinalShippingPrice(shippingTypeId: number, orderAmount: number) {
    const shippingType = await strapi.entityService.findOne('api::shipping-type.shipping-type', shippingTypeId);
    
    if (!shippingType || !shippingType.isActive) {
      throw new Error('Type de livraison non disponible');
    }

    let finalPrice = shippingType.price;

    if (shippingType.freeShippingThreshold && orderAmount >= shippingType.freeShippingThreshold) {
      finalPrice = 0;
    }

    return {
      ...shippingType,
      finalPrice,
      isFree: finalPrice === 0
    };
  },

  async validateShippingType(shippingTypeId: number, orderAmount: number, weight: number) {
    const shippingType = await strapi.entityService.findOne('api::shipping-type.shipping-type', shippingTypeId);
    
    if (!shippingType || !shippingType.isActive) {
      return { isValid: false, reason: 'Type de livraison non disponible' };
    }

    if (shippingType.minOrderAmount && orderAmount < shippingType.minOrderAmount) {
      return { 
        isValid: false, 
        reason: `Montant minimum requis: ${shippingType.minOrderAmount}€` 
      };
    }

    if (shippingType.maxWeight && weight > shippingType.maxWeight) {
      return { 
        isValid: false, 
        reason: `Poids maximum autorisé: ${shippingType.maxWeight}kg` 
      };
    }

    return { isValid: true };
  }
})); 
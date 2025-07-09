/**
 * shipping-type controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::shipping-type.shipping-type', ({ strapi }) => ({
  async findActive(ctx) {
    try {
      const shippingTypes = await strapi.entityService.findMany('api::shipping-type.shipping-type', {
        filters: {
          isActive: true,
          publishedAt: { $notNull: true }
        },
        sort: { priority: 'asc', name: 'asc' },
        populate: '*'
      });

      return { data: shippingTypes };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async calculateShippingOptions(ctx) {
    try {
      const orderAmount = Number(ctx.query.orderAmount) || 0;
      const weight = Number(ctx.query.weight) || 0;

      const shippingTypes = await strapi.entityService.findMany('api::shipping-type.shipping-type', {
        filters: {
          isActive: true,
          publishedAt: { $notNull: true }
        },
        sort: { priority: 'asc', name: 'asc' },
        populate: '*'
      });

      const availableOptions = shippingTypes.filter(type => {
        if (type.minOrderAmount && orderAmount < type.minOrderAmount) {
          return false;
        }

        if (type.maxWeight && weight > type.maxWeight) {
          return false;
        }

        return true;
      });

      const optionsWithFinalPrice = availableOptions.map(type => {
        let finalPrice = type.price;

        if (type.freeShippingThreshold && orderAmount >= type.freeShippingThreshold) {
          finalPrice = 0;
        }

        return {
          ...type,
          finalPrice,
          isFree: finalPrice === 0
        };
      });

      return { data: optionsWithFinalPrice };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
})); 
export default {
  routes: [
    {
      method: 'GET',
      path: '/promotions',
      handler: 'promotion.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/promotions/:id',
      handler: 'promotion.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/promotions',
      handler: 'promotion.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/promotions/:id',
      handler: 'promotion.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/promotions/:id',
      handler: 'promotion.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/promotions/calculate-discounts',
      handler: 'promotion.calculateDiscounts',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/promotions/product/:productId',
      handler: 'promotion.getProductPromotions',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 
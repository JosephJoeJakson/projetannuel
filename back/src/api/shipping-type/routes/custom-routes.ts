
export default {
  routes: [
    {
      method: 'GET',
      path: '/shipping-types/active',
      handler: 'shipping-type.findActive',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/shipping-types/calculate',
      handler: 'shipping-type.calculateShippingOptions',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 
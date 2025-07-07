export default {
  routes: [
    {
      method: 'GET',
      path: '/payment-methods/user',
      handler: 'payment-method.getUserPaymentMethods',
      config: {
        policies: [],
        middlewares: ['api::payment-method.auth']
      }
    },
    {
      method: 'POST',
      path: '/payment-methods/user',
      handler: 'payment-method.addUserPaymentMethod',
      config: {
        policies: [],
        middlewares: ['api::payment-method.auth']
      }
    },
    {
      method: 'PUT',
      path: '/payment-methods/user/:id',
      handler: 'payment-method.updateUserPaymentMethod',
      config: {
        policies: [],
        middlewares: ['api::payment-method.auth']
      }
    },
    {
      method: 'DELETE',
      path: '/payment-methods/user/:id',
      handler: 'payment-method.deleteUserPaymentMethod',
      config: {
        policies: [],
        middlewares: ['api::payment-method.auth']
      }
    }
  ]
}; 
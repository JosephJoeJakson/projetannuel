export default {
  routes: [
    {
      method: 'GET',
      path: '/addresses/user',
      handler: 'address.getUserAddresses',
      config: {
        policies: [],
        middlewares: ['api::address.auth']
      }
    },
    {
      method: 'POST',
      path: '/addresses/user',
      handler: 'address.addUserAddress',
      config: {
        policies: [],
        middlewares: ['api::address.auth']
      }
    },
    {
      method: 'PUT',
      path: '/addresses/user/:id',
      handler: 'address.updateUserAddress',
      config: {
        policies: [],
        middlewares: ['api::address.auth']
      }
    },
    {
      method: 'DELETE',
      path: '/addresses/user/:id',
      handler: 'address.deleteUserAddress',
      config: {
        policies: [],
        middlewares: ['api::address.auth']
      }
    }
  ]
}; 
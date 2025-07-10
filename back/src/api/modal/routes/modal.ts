export default {
  routes: [
    {
      method: 'GET',
      path: '/modals',
      handler: 'modal.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/modals/:id',
      handler: 'modal.findOne',
      config: {
        policies: [],
      },
    },
  ],
}; 
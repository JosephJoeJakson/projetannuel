export default {
  routes: [
    {
      method: 'POST',
      path: '/creation-comments',
      handler: 'creation-comment.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/creation-comments',
      handler: 'creation-comment.findAll',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/creation-comments/creation/:creationId',
      handler: 'creation-comment.findByCreation',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/creation-comments/:id/status',
      handler: 'creation-comment.updateStatus',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 
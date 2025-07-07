export default (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      if (!ctx.state.user) {
        return ctx.unauthorized('Utilisateur non connecté');
      }
      
      await next();
    } catch (error) {
      return ctx.unauthorized('Token invalide');
    }
  };
}; 
export default (config, { strapi }) => {
  return async (ctx, next) => {
    strapi.log.info('In page middleware.');
    await next();
  };
}; 
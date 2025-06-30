import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const user = ctx.state.user;
        if (!user) return ctx.unauthorized('Non authentifié');

        ctx.request.body.data.users_permissions_user = user.id;

        return super.create(ctx);
    },
}));

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const user = ctx.state.user;
        if (!user) return ctx.unauthorized('Non authentifié');

        ctx.request.body.data.users_permissions_user = user.id;

        const result = await strapi.service('api::order.order').create(ctx.request.body);

        const { shippingAddress, billingAddress, paymentMethod } = ctx.request.body.data;
        
        if (shippingAddress || billingAddress || paymentMethod) {
            const updateData: any = {};
            
            if (shippingAddress) {
                updateData.shippingAddress = shippingAddress;
            }
            if (billingAddress) {
                updateData.billingAddress = billingAddress;
            } else if (shippingAddress) {
                updateData.billingAddress = shippingAddress;
            }
            if (paymentMethod) {
                updateData.paymentMethod = paymentMethod;
            }

            await strapi.service('api::order.order').update(result.id, {
                data: updateData
            });
        }

        return result;
    },
}));

import { factories } from '@strapi/strapi';
import emailService from '../../../services/email';

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

        try {
            const orderWithRelations = await strapi.entityService.findOne('api::order.order', result.id, {
                populate: {
                    order_items: {
                        populate: {
                            product: true
                        }
                    },
                    users_permissions_user: true
                }
            });

            const userInfo = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
                populate: '*'
            });

            await emailService.sendOrderConfirmation(orderWithRelations, userInfo);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
        }

        return result;
    },
}));

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::payment-method.payment-method', ({ strapi }) => ({
  async getUserPaymentMethods(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    try {
      const paymentMethods = await strapi.db.query('api::payment-method.payment-method').findMany({
        where: {
          users_permissions_user: user.id
        },
        orderBy: { isDefault: 'desc', createdAt: 'desc' }
      });

      return ctx.send({
        paymentMethods: paymentMethods || []
      });
    } catch (error) {
      return ctx.badRequest('Erreur lors de la récupération des moyens de paiement');
    }
  },

  async addUserPaymentMethod(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    const { body } = ctx.request;
    
    try {
      if (body.isDefault) {
        const existingDefaultPaymentMethods = await strapi.db.query('api::payment-method.payment-method').findMany({
          where: {
            users_permissions_user: user.id,
            isDefault: true
          }
        });

        for (const paymentMethod of existingDefaultPaymentMethods) {
          await strapi.db.query('api::payment-method.payment-method').update({
            where: { id: paymentMethod.id },
            data: { isDefault: false }
          });
        }
      }

      const newPaymentMethod = await strapi.db.query('api::payment-method.payment-method').create({
        data: {
          ...body,
          users_permissions_user: user.id
        }
      });

      const paymentMethods = await strapi.db.query('api::payment-method.payment-method').findMany({
        where: {
          users_permissions_user: user.id
        },
        orderBy: { isDefault: 'desc', createdAt: 'desc' }
      });

      return ctx.send({
        message: 'Moyen de paiement ajouté avec succès',
        paymentMethods: paymentMethods
      });
    } catch (error) {
      return ctx.badRequest('Erreur lors de l\'ajout du moyen de paiement');
    }
  },

  async updateUserPaymentMethod(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;
    const { body } = ctx.request;

    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    try {
      const existingPaymentMethod = await strapi.db.query('api::payment-method.payment-method').findOne({
        where: {
          id: parseInt(id),
          users_permissions_user: user.id
        }
      });

      if (!existingPaymentMethod) {
        return ctx.notFound('Moyen de paiement non trouvé');
      }

      if (body.isDefault) {
        const otherDefaultPaymentMethods = await strapi.db.query('api::payment-method.payment-method').findMany({
          where: {
            users_permissions_user: user.id,
            isDefault: true
          }
        });

        for (const paymentMethod of otherDefaultPaymentMethods) {
          if (paymentMethod.id !== parseInt(id)) {
            await strapi.db.query('api::payment-method.payment-method').update({
              where: { id: paymentMethod.id },
              data: { isDefault: false }
            });
          }
        }
      }

      const updatedPaymentMethod = await strapi.db.query('api::payment-method.payment-method').update({
        where: { id: parseInt(id) },
        data: body
      });

      const paymentMethods = await strapi.db.query('api::payment-method.payment-method').findMany({
        where: {
          users_permissions_user: user.id
        },
        orderBy: { isDefault: 'desc', createdAt: 'desc' }
      });

      return ctx.send({
        message: 'Moyen de paiement mis à jour avec succès',
        paymentMethods: paymentMethods
      });
    } catch (error) {
      return ctx.badRequest('Erreur lors de la mise à jour du moyen de paiement');
    }
  },

  async deleteUserPaymentMethod(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;

    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    try {
      const existingPaymentMethod = await strapi.db.query('api::payment-method.payment-method').findOne({
        where: {
          id: parseInt(id),
          users_permissions_user: user.id
        }
      });

      if (!existingPaymentMethod) {
        return ctx.notFound('Moyen de paiement non trouvé');
      }

      await strapi.db.query('api::payment-method.payment-method').delete({
        where: { id: parseInt(id) }
      });

      const paymentMethods = await strapi.db.query('api::payment-method.payment-method').findMany({
        where: {
          users_permissions_user: user.id
        },
        orderBy: { isDefault: 'desc', createdAt: 'desc' }
      });

      return ctx.send({
        message: 'Moyen de paiement supprimé avec succès',
        paymentMethods: paymentMethods
      });
    } catch (error) {
      return ctx.badRequest('Erreur lors de la suppression du moyen de paiement');
    }
  }
})); 
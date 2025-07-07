import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::address.address', ({ strapi }) => ({
  async getUserAddresses(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    try {
      const addresses = await strapi.db.query('api::address.address').findMany({
        where: {
          users_permissions_user: user.id
        },
        orderBy: { isDefault: 'desc', createdAt: 'desc' }
      });

      return ctx.send({
        addresses: addresses || []
      });
    } catch (error) {
      return ctx.badRequest('Erreur lors de la récupération des adresses');
    }
  },

  async addUserAddress(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    const { body } = ctx.request;
    
    try {
      if (body.isDefault) {
        const existingDefaultAddresses = await strapi.db.query('api::address.address').findMany({
          where: {
            users_permissions_user: user.id,
            isDefault: true
          }
        });

        for (const address of existingDefaultAddresses) {
          await strapi.db.query('api::address.address').update({
            where: { id: address.id },
            data: { isDefault: false }
          });
        }
      }

      const newAddress = await strapi.db.query('api::address.address').create({
        data: {
          ...body,
          users_permissions_user: user.id
        }
      });

      const addresses = await strapi.db.query('api::address.address').findMany({
        where: {
          users_permissions_user: user.id
        },
        orderBy: { isDefault: 'desc', createdAt: 'desc' }
      });

      return ctx.send({
        message: 'Adresse ajoutée avec succès',
        addresses: addresses
      });
    } catch (error) {
      return ctx.badRequest('Erreur lors de l\'ajout de l\'adresse');
    }
  },

  async updateUserAddress(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;
    const { body } = ctx.request;

    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    try {
      const existingAddress = await strapi.db.query('api::address.address').findOne({
        where: {
          id: parseInt(id),
          users_permissions_user: user.id
        }
      });

      if (!existingAddress) {
        return ctx.notFound('Adresse non trouvée');
      }

      if (body.isDefault) {
        const otherDefaultAddresses = await strapi.db.query('api::address.address').findMany({
          where: {
            users_permissions_user: user.id,
            isDefault: true
          }
        });

        for (const address of otherDefaultAddresses) {
          if (address.id !== parseInt(id)) {
            await strapi.db.query('api::address.address').update({
              where: { id: address.id },
              data: { isDefault: false }
            });
          }
        }
      }

      const updatedAddress = await strapi.db.query('api::address.address').update({
        where: { id: parseInt(id) },
        data: body
      });

      const addresses = await strapi.db.query('api::address.address').findMany({
        where: {
          users_permissions_user: user.id
        },
        orderBy: { isDefault: 'desc', createdAt: 'desc' }
      });

      return ctx.send({
        message: 'Adresse mise à jour avec succès',
        addresses: addresses
      });
    } catch (error) {
      return ctx.badRequest('Erreur lors de la mise à jour de l\'adresse');
    }
  },

  async deleteUserAddress(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;

    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    try {
      const existingAddress = await strapi.db.query('api::address.address').findOne({
        where: {
          id: parseInt(id),
          users_permissions_user: user.id
        }
      });

      if (!existingAddress) {
        return ctx.notFound('Adresse non trouvée');
      }

      await strapi.db.query('api::address.address').delete({
        where: { id: parseInt(id) }
      });

      const addresses = await strapi.db.query('api::address.address').findMany({
        where: {
          users_permissions_user: user.id
        },
        orderBy: { isDefault: 'desc', createdAt: 'desc' }
      });

      return ctx.send({
        message: 'Adresse supprimée avec succès',
        addresses: addresses
      });
    } catch (error) {
      return ctx.badRequest('Erreur lors de la suppression de l\'adresse');
    }
  }
})); 
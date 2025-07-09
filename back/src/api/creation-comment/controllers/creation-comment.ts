import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::creation-comment.creation-comment', ({ strapi }) => ({
  // Créer un nouveau commentaire
  async create(ctx) {
    try {
      const { name, firstname, email, comment, creation } = ctx.request.body;

      // Validation des données
      if (!name || !firstname || !email || !comment || !creation) {
        return ctx.badRequest('Tous les champs sont requis');
      }

      // Vérifier que la création existe
      const creationExists = await strapi.entityService.findOne('api::creation.creation', creation);
      if (!creationExists) {
        return ctx.badRequest('Création introuvable');
      }

      // Créer le commentaire avec le statut "pending"
      const newComment = await strapi.entityService.create('api::creation-comment.creation-comment', {
        data: {
          name,
          firstname,
          email,
          comment,
          creation,
          status: 'pending'
        }
      });

      return ctx.send({ data: newComment });
    } catch (error) {
      return ctx.internalServerError('Erreur lors de la création du commentaire');
    }
  },

  // Lister les commentaires approuvés pour une création
  async findByCreation(ctx) {
    try {
      const { creationId } = ctx.params;

      const comments = await strapi.entityService.findMany('api::creation-comment.creation-comment', {
        filters: {
          creation: creationId,
          // Temporairement, on récupère tous les commentaires pour tester
          // status: 'approved'
        },
        sort: { createdAt: 'desc' },
        populate: {
          creation: {
            fields: ['id', 'name', 'slug']
          }
        }
      });

      return ctx.send({ data: comments });
    } catch (error) {
      return ctx.internalServerError('Erreur lors de la récupération des commentaires');
    }
  },

  // Lister tous les commentaires (pour l'admin)
  async findAll(ctx) {
    try {
      const { page = 1, pageSize = 25, status } = ctx.query;

      const filters: any = {};
      if (status) {
        filters.status = status;
      }

      const comments = await strapi.entityService.findPage('api::creation-comment.creation-comment', {
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
        filters,
        sort: { createdAt: 'desc' },
        populate: {
          creation: {
            fields: ['id', 'name', 'slug']
          }
        }
      });

      return ctx.send(comments);
    } catch (error) {
      return ctx.internalServerError('Erreur lors de la récupération des commentaires');
    }
  },

  // Modifier le statut d'un commentaire (pour l'admin)
  async updateStatus(ctx) {
    try {
      const { id } = ctx.params;
      const { status } = ctx.request.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return ctx.badRequest('Statut invalide');
      }

      const updatedComment = await strapi.entityService.update('api::creation-comment.creation-comment', id, {
        data: { status }
      });

      return ctx.send({ data: updatedComment });
    } catch (error) {
      return ctx.internalServerError('Erreur lors de la mise à jour du statut');
    }
  }
})); 
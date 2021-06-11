'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { game_config: gameConfigID, action } = ctx.request.body;
    const lastDeployment = await strapi.services["game-deployment"].find({
      _sort: 'created_at:desc',
      _limit: 1,
      game_config: gameConfigID,
      status: 'WAITING',
    });

    if (lastDeployment.length > 0) {
      return ctx.badRequest(null, [{ messages: [{ id: 'Game is already deploying.' }] }]);
    }

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['game-deployment'].create(data, { files });
    } else {
      entity = await strapi.services['game-deployment'].create(ctx.request.body);
    }

    switch (action) {
      case 'START':
        await strapi.services['game-config'].update({ id: gameConfigID }, { status: 'STARTING' });
        break;
      case 'STOP':
        await strapi.services['game-config'].update({ id: gameConfigID }, { status: 'STOPPING' });
        break;
      default:
        throw new Error('invalid');
    }

    return sanitizeEntity(entity, { model: strapi.models['game-deployment'] });
  },
};

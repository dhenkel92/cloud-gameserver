'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const gameConfigId = ctx.request.body.game_config;

    const gameConfig = await strapi.services["game-config"].findOne({id: gameConfigId});
    if (gameConfig === null) {
      throw new Error('Game Config was not found!');
    }

    if (gameConfig.status === 'ACTION_SCHEDULED') {
      throw new Error('Action already scheduled, please wait until done');
    }

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['game-deployment'].create(data, { files });
    } else {
      entity = await strapi.services['game-deployment'].create(ctx.request.body);
    }

    await strapi.services['game-config'].update({id: gameConfigId}, {status: 'ACTION_SCHEDULED'});

    return sanitizeEntity(entity, { model: strapi.models['game-deployment'] });
  },
};

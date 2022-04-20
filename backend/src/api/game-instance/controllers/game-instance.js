'use strict';

/**
 *  game-instance controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::game-instance.game-instance');

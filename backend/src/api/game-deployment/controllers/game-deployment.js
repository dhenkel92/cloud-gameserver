'use strict';

/**
 *  game-deployment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::game-deployment.game-deployment');

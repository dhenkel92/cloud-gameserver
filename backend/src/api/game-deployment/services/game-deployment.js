'use strict';

/**
 * game-deployment service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-deployment.game-deployment');

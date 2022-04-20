'use strict';

/**
 * game-instance service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-instance.game-instance');

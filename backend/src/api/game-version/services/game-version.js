'use strict';

/**
 * game-version service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-version.game-version');

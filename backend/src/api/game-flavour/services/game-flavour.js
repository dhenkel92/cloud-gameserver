'use strict';

/**
 * game-flavour service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-flavour.game-flavour');

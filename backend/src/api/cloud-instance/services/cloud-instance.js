'use strict';

/**
 * cloud-instance service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cloud-instance.cloud-instance');

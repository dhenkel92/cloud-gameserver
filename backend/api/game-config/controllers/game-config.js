'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'User is not authenticated' }] }]);
    }

    const query = {
      ...ctx.query,
      user: user.id,
    }
    let data;
    if (ctx.query._q) {
      data = await strapi.services['game-config'].search(query);
    } else {
      data = await strapi.services['game-config'].find(query);
    }

    ctx.send(data ? data : []);
  },
  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'User is not authenticated' }] }]);
    }

    const query = {
      ...ctx.query,
      user: user.id,
    }

    let data;
    if (ctx.query._q) {
      data = await strapi.services['game-config'].search(query);
    } else {
      data = await strapi.services['game-config'].findOne(query);
    }

    ctx.send(data);
  }
};

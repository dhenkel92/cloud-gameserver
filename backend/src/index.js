"use strict";

require("dd-trace").init();
// const middlewares = require('./graphql/middlewares');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
    const extension = ({ nexus }) => ({
      typeDefs: `
        type GameServerPort {
          port: Int!
          protocol: String!
          is_open: Boolean!
        }
        extend type GameDeployment {
          game_server_ports: [GameServerPort!]
        }
      `,
      resolvers: {
        GameDeployment: {
          game_server_ports: {
            resolve: async (parent, args, context) => {
              console.log(parent.id);
              const data = await fetch("http://localhost:8080/ports");
              return data.json();
            },
          },
        },
      },
      // plugins: [nexus.plugin({})],
    });

    strapi.plugin("graphql").service("extension").use(extension);
    // const extensionService = strapi.plugin('graphql').service('extension');
    // extensionService.use({
    // resolversConfig: {
    // 'Query.gameInstances': {
    // middlewares: [
    // middlewares.filterUsers,
    // ],
    // },
    // },
    // })
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};

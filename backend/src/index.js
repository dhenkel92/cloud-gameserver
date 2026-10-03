"use strict";

module.exports = {
  register({ strapi }) {
    const extension = () => ({
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
            resolve: async () => {
              const data = await fetch("http://localhost:8080/ports");
              return data.json();
            },
          },
        },
      },
    });

    strapi.plugin("graphql").service("extension").use(extension);
  },
};

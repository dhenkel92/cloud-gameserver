module.exports = {
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      landingPage: (strapi) => strapi.config.get("environment") !== "production",
      v4CompatibilityMode: false,
      depthLimit: 20,
      defaultLimit: 10,
      maxLimit: 100,
      apolloServer: {
        introspection: process.env.NODE_ENV !== "production",
      },
    },
  },
  blueprint: {
    enabled: true,
  },
};

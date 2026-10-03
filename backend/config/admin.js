module.exports = ({ env }) => ({
  url: env("ADMIN_URL", "/admin/"),
  serveAdminPanel: env.bool("SERVE_ADMIN_PANEL", true),
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
    cookie: {
      path: env("ADMIN_URL", "/admin").replace(/\/$/, "") || "/",
    },
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
    secrets: {
      encryptionKey: env("ENCRYPTION_KEY"),
    },
  },
});

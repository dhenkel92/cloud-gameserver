module.exports = ({ env }) => ({
  url: env("ADMIN_URL", "/admin/"),
  serveAdminPanel: env("SERVE_ADMIN_PANEL", true),
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
});

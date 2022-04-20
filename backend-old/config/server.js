module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env('PORT', '1338'),
  proxy: {
    enabled: false
  },
  cron: {
    enabled: false
  },
  admin: {
    autoOpen: false,
    auth: {
      secret: env('ADMIN_JWT_SECRET', '6974ce49-975a-4a45-be32-3e9e266ae1d3'),
    }
  }
});

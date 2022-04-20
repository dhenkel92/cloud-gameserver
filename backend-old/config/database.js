module.exports = ({ env }) => ({
  "defaultConnection": "default",
  "connections": {
    "default": {
      "connector": "bookshelf",
      "settings": {
        "client": env('DATABASE_CLIENT', 'mysql'),
        "host": env('DATABASE_HOST', '127.0.0.1'),
        "port": env('DATABASE_PORT', '3306'),
        "database": env('DATABASE_NAME', 'strapi'),
        "username": env('DATABASE_USERNAME', 'strapi'),
        "password": env('DATABASE_PASSWORD', 'strapi'),
      },
      "options": {}
    }
  }
});

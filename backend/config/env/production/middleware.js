module.exports = {
  "production": true,
  url: 'https://api.cloud-game.app',
  "cron": {
    "enabled": false
  },
  "logger": {
    "level": "info",
    "exposeInContext": true,
    "requests": false
  },
  "gzip": {
    "enabled": true
  },
  "p3p": {
    "enabled": true,
    "value": ""
  },
}

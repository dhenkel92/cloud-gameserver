module.exports = {
  "production": true,
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

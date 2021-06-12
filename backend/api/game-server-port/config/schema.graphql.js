const fetch = require('node-fetch');

module.exports = {
  resolver: {
    Query: {
      gameServerPorts: false,
      gameServerPort: false,
    },
    Mutation: {
      createGameServerPort: false,
      updateGameServerPort: false,
      deleteGameServerPort: false,
    },
    GameServer: {
      game_server_ports: async ({private_ip}) => {
        const res = await fetch(`http://${private_ip}:8080/watchers/game/`);
        const configs = await res.json();
        return configs.data.ports;
      },
    },
  },
};

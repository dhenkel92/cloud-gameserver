import { gql } from '@apollo/client';

export const GAME_CONFIG_DETAILS = gql`
  query gameConfig($id: ID!) {
    gameConfig(id: $id) {
      id
      name
      status
      game {
        name
      }
      game_deployments(limit: 1, sort: "created_at:desc") {
        action
        created_at
      }
    }
  }
`;

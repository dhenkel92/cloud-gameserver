import * as config from 'config';
import pino from 'pino';

const apiUrl = config.get<string>('cloudGame.apiUrl');

export async function gqlQuery(logger: pino.Logger, query: string, data: any): Promise<Response> {
  logger.child({ url: `${apiUrl}/graphql`, query, data }).info('Fetch API data');
  return fetch(`${apiUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: config.get<string>('cloudGame.apiToken'),
    },
    body: JSON.stringify({
      query,
      variables: data,
    }),
  });
}

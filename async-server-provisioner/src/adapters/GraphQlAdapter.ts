import * as config from 'config';

const apiUrl = config.get<string>('cloudGame.apiUrl');

export async function gqlQuery(query: string, data: any): Promise<any> {
  const res = await fetch(`${apiUrl}/graphql`, {
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
  return res.json();
}

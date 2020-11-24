import * as mysql from 'mysql';

export default class MySqlAdapter {
  constructor(private connection: mysql.Connection) {
  }

  public close() {
    this.connection.destroy();
  }

  public async query(query: string, args: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, args, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }
}

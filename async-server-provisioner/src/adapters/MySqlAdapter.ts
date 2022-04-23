import * as mysql from 'mysql';

export default class MySqlAdapter {
  constructor(private connection: mysql.Connection) {}

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

  public async beginTransaction(): Promise<void> {
    await new Promise((resolve, reject) => {
      this.connection.beginTransaction((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(null);
      });
    });
  }

  public async commit(): Promise<void> {
    await new Promise((resolve, reject) => {
      this.connection.commit((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(null);
      });
    });
  }

  public async rollback(): Promise<void> {
    await new Promise((resolve, reject) => {
      this.connection.rollback((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(null);
      });
    });
  }
}

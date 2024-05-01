import * as mysql from 'mysql2/promise';

export default class MySqlAdapter {
  constructor(private connection: mysql.Connection) {}

  public async query(query: string, args: any[] = []): Promise<any> {
    return this.connection.query(query, args);
  }

  public async beginTransaction(): Promise<void> {
    await this.connection.beginTransaction();
  }

  public async commit(): Promise<void> {
    await this.connection.commit();
  }

  public async rollback(): Promise<void> {
    await this.connection.rollback();
  }
}

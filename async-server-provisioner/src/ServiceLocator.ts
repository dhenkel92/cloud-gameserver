import * as config from 'config';
import * as mysql from 'mysql';
import MySqlAdapter from './adapters/MySqlAdapter';
import GameDeploymentRepository from './repositories/GameDeploymentRepository';
import { GameDeploymentService } from './services/GameDeploymentService';
import { ShellAdapter } from './adapters/ShellAdapter';
import { TerraformService } from './services/TerraformService';
import { GameDeploymentLogRepository } from './repositories/GameDeploymentLogRepository';

export default class ServiceLocator {
  private static instance: ServiceLocator | null;
  private cache: Map<string, any> = new Map();

  public static getInstance(): ServiceLocator {
    if (ServiceLocator.instance == null) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  private getFromCache<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  private hasCached(key: string): boolean {
    return this.cache.has(key);
  }

  private setCache<T>(key: string, value: T) {
    this.cache.set(key, value);
  }

  private async getMysqlConnection(): Promise<mysql.Connection> {
    if (this.hasCached('mysqlConnection')) {
      return this.getFromCache('mysqlConnection');
    }

    // todo: replace with pool
    const connection = await new Promise<mysql.Connection>((resolve, reject) => {
      const conn = mysql.createConnection({
        database: config.get('mysql.database'),
        host: config.get('mysql.host'),
        port: config.get('mysql.port'),
        user: config.get('mysql.user'),
        password: config.get('mysql.pw'),
      });
      conn.connect((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(conn);
      });
    });

    this.setCache('mysqlConnection', connection);
    return connection;
  }

  /***********************************************************
   *
   * Adapters
   *
   ***********************************************************/
  public async getMySqlAdapter(): Promise<MySqlAdapter> {
    if (this.hasCached('MySqlAdapter')) {
      return this.getFromCache('MySqlAdapter');
    }
    const connection = await this.getMysqlConnection();
    const adapter = new MySqlAdapter(connection);

    this.setCache('MySqlAdapter', adapter);
    return adapter;
  }

  private getShellAdapter(): ShellAdapter {
    if (this.hasCached('ShellAdapter')) {
      return this.getFromCache('ShellAdapter');
    }

    const adapter = new ShellAdapter();

    this.setCache('ShellAdapter', adapter);
    return adapter;
  }

  /***********************************************************
   *
   * Repositories
   *
   ***********************************************************/
  public async getGameDeploymentRepository(): Promise<GameDeploymentRepository> {
    if (this.hasCached('GameDeploymentRepository')) {
      return this.getFromCache('GameDeploymentRepository');
    }
    const adapter = await this.getMySqlAdapter();
    const repo = new GameDeploymentRepository(adapter);

    this.setCache('GameDeploymentRepository', repo);
    return repo;
  }

  public async getGameDeploymentLogRepository(): Promise<GameDeploymentLogRepository> {
    if (this.hasCached('GameDeploymentLogRepository')) {
      return this.getFromCache('GameDeploymentLogRepository');
    }

    const adapter = await this.getMySqlAdapter();
    const repo = new GameDeploymentLogRepository(adapter);

    this.setCache('GameDeploymentLogRepository', repo);
    return repo;
  }

  /***********************************************************
   *
   * Services
   *
   ***********************************************************/
  public async getGameDeploymentService(): Promise<GameDeploymentService> {
    if (this.hasCached('GameDeploymentService')) {
      return this.getFromCache('GameDeploymentService');
    }

    const [deployRepo, deployLogRepo] = await Promise.all([
      this.getGameDeploymentRepository(),
      this.getGameDeploymentLogRepository(),
    ]);

    const terraformService = this.getTerraformService();
    const service = new GameDeploymentService(terraformService, deployRepo, deployLogRepo);

    this.setCache('GameDeploymentService', service);
    return service;
  }

  public getTerraformService(): TerraformService {
    if (this.hasCached('TerraformService')) {
      return this.getFromCache('TerraformService');
    }

    const service = new TerraformService(this.getShellAdapter());

    this.setCache('TerraformService', service);
    return service;
  }
}

import * as config from 'config';
import * as mysql from 'mysql';
import * as pino from 'pino';
import MySqlAdapter from './adapters/MySqlAdapter';
import GameDeploymentRepository from './repositories/GameDeploymentRepository';
import { GameDeploymentService } from './services/GameDeploymentService';
import { ShellAdapter } from './adapters/ShellAdapter';
import { TerraformService } from './services/TerraformService';
import { GameDeploymentLogRepository } from './repositories/GameDeploymentLogRepository';
import { HetznerCloudAdapter } from './adapters/HetznerCloudAdapter';
import { HetznerCloudRepository } from './repositories/HetznerCloudRepository';
import { GameConfigRepository } from './repositories/GameConfigRepository';
import { GameServerRepository } from './repositories/GameServerRepository';

export default class ServiceLocator {
  private static instance: ServiceLocator | null;
  private cache: Map<string, any> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

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

  /***********************************************************
   *
   * General
   *
   ***********************************************************/
  getLogger(): pino.Logger {
    if (this.hasCached('Logger')) {
      return this.getFromCache('Logger');
    }

    const logger = pino();
    this.setCache('Logger', logger);
    return logger;
  }

  private async getMysqlConnection(isReadUncommitted = false): Promise<mysql.Connection> {
    return await new Promise<mysql.Connection>((resolve, reject) => {
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

        if (!isReadUncommitted) {
          resolve(conn);
          return;
        }

        conn.query('SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED', (mysqlErr) => {
          if (mysqlErr) {
            reject(mysqlErr);
            return;
          }
          resolve(conn);
        });
      });
    });
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
    const connection = await this.getMysqlConnection(false);
    const adapter = new MySqlAdapter(connection);

    this.setCache('MySqlAdapter', adapter);
    return adapter;
  }

  public async getDirtyMySqlAdapter(): Promise<MySqlAdapter> {
    if (this.hasCached('MySqlAdapter')) {
      return this.getFromCache('MySqlAdapter');
    }
    const connection = await this.getMysqlConnection(true);
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

  private getHetznerCloudAdapter(): HetznerCloudAdapter {
    if (this.hasCached('HetznerCloudAdapter')) {
      return this.getFromCache('HetznerCloudAdapter');
    }

    const adapter = new HetznerCloudAdapter(config.get('hetzner.token'));
    this.setCache('HetznerCloudAdapter', adapter);
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
    const dirtyAdapter = await this.getDirtyMySqlAdapter();
    const repo = new GameDeploymentRepository(adapter, dirtyAdapter);

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

  public getHetznerCloudRepository(): HetznerCloudRepository {
    if (this.hasCached('HetznerCloudRepository')) {
      return this.getFromCache('HetznerCloudRepository');
    }

    const repo = new HetznerCloudRepository(this.getHetznerCloudAdapter(), this.getLogger());
    this.setCache('HetznerCloudRepository', repo);
    return repo;
  }

  public async getGameConfigRepository(): Promise<GameConfigRepository> {
    if (this.hasCached('GameConfigRepository')) {
      return this.getFromCache('GameConfigRepository');
    }

    const repo = new GameConfigRepository(await this.getMySqlAdapter());
    this.setCache('GameConfigRepository', repo);
    return repo;
  }

  public async getGameServerRepository(): Promise<GameServerRepository> {
    if (this.hasCached('GameServerRepository')) {
      return this.getFromCache('GameServerRepository');
    }

    const repo = new GameServerRepository(await this.getMySqlAdapter());
    this.setCache('GameServerRepository', repo);
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

    const [deployRepo, configRepo, deployLogRepo, gameServerRepo] = await Promise.all([
      this.getGameDeploymentRepository(),
      this.getGameConfigRepository(),
      this.getGameDeploymentLogRepository(),
      this.getGameServerRepository(),
    ]);

    const terraformService = await this.getTerraformService();
    const service = new GameDeploymentService(
      terraformService,
      deployRepo,
      configRepo,
      deployLogRepo,
      this.getHetznerCloudRepository(),
      gameServerRepo,
      this.getLogger()
    );

    this.setCache('GameDeploymentService', service);
    return service;
  }

  public async getTerraformService(): Promise<TerraformService> {
    if (this.hasCached('TerraformService')) {
      return this.getFromCache('TerraformService');
    }

    const repo = await this.getGameDeploymentLogRepository();
    const service = new TerraformService(config.get('terraform_path'), this.getShellAdapter(), repo, this.getLogger());

    this.setCache('TerraformService', service);
    return service;
  }
}

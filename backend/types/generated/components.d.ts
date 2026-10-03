import type { Schema, Struct } from '@strapi/strapi';

export interface ServerConfigBackupPath extends Struct.ComponentSchema {
  collectionName: 'components_server_config_backup_paths';
  info: {
    displayName: 'BackupPath';
    icon: 'ambulance';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    path: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServerConfigLogFile extends Struct.ComponentSchema {
  collectionName: 'components_server_config_log_files';
  info: {
    displayName: 'LogFile';
    icon: 'air-freshener';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    path: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServerConfigPort extends Struct.ComponentSchema {
  collectionName: 'components_server_config_ports';
  info: {
    description: '';
    displayName: 'Port';
    icon: 'address-book';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    port: Schema.Attribute.Integer & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['TCP', 'UDP']> &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'server-config.backup-path': ServerConfigBackupPath;
      'server-config.log-file': ServerConfigLogFile;
      'server-config.port': ServerConfigPort;
    }
  }
}

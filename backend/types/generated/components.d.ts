import type { Schema, Attribute } from '@strapi/strapi';

export interface ServerConfigBackupPath extends Schema.Component {
  collectionName: 'components_server_config_backup_paths';
  info: {
    displayName: 'BackupPath';
    icon: 'ambulance';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    path: Attribute.String & Attribute.Required;
  };
}

export interface ServerConfigLogFile extends Schema.Component {
  collectionName: 'components_server_config_log_files';
  info: {
    displayName: 'LogFile';
    icon: 'air-freshener';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    path: Attribute.String & Attribute.Required;
  };
}

export interface ServerConfigPort extends Schema.Component {
  collectionName: 'components_server_config_ports';
  info: {
    displayName: 'Port';
    icon: 'address-book';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    port: Attribute.Integer & Attribute.Required;
    type: Attribute.Enumeration<['TCP', 'UDP']> & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'server-config.backup-path': ServerConfigBackupPath;
      'server-config.log-file': ServerConfigLogFile;
      'server-config.port': ServerConfigPort;
    }
  }
}

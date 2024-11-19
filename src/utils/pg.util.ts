import { parse } from 'pg-connection-string';
import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const parsePostgresConnectionString = (
  config: App.DataSourceConfiguration,
): DataSourceOptions => {
  const { connectionString, ...dataSourceConfig } = config;

  const parsed: Record<string, any> = connectionString
    ? parse(connectionString)
    : {};

  const dataSourceOptions: PostgresConnectionOptions = {
    type: 'postgres',
    host: parsed.host,
    port: parseInt(parsed.port || '5432', 10),
    username: parsed.user,
    password: parsed.password,
    database: parsed.database,
  } satisfies PostgresConnectionOptions;

  if (dataSourceConfig?.connectionTimeout) {
    Object.assign(dataSourceOptions, {
      connectTimeoutMS: dataSourceConfig.connectionTimeout,
    });
  }

  return dataSourceOptions;
};

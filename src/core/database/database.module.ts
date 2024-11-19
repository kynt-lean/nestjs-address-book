import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TypeOrmDataSourceFactory,
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DEFAULT_DATA_SOURCE_NAME } from '@nestjs/typeorm/dist/typeorm.constants';
import { DataSource, DataSourceOptions } from 'typeorm';
import { mergeObject } from '../../utils/object.util';

export interface DatabaseModuleOptions {
  dataSourceOptions: TypeOrmModuleOptions;
  parseConnectionStringFactory?: ParseConnectionStringFactory;
  dataSourceName?: string;
  dataSourceFactory?: TypeOrmDataSourceFactory;
}

export type ParseConnectionStringFactory = (
  config: App.DataSourceConfiguration,
) => DataSourceOptions;

@Module({})
export class DatabaseModule {
  public static forRoot(options: DatabaseModuleOptions): DynamicModule {
    const { dataSourceOptions, parseConnectionStringFactory } = options;
    const dataSourceName = options.dataSourceName || DEFAULT_DATA_SOURCE_NAME;
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          name: dataSourceName,
          inject: [ConfigService],
          useFactory: (config: ConfigService<App.Configuration>) =>
            mergeObject(
              dataSourceOptions,
              getDataSourceOptions(
                config,
                dataSourceName,
                parseConnectionStringFactory,
              ),
            ),
          dataSourceFactory: options.dataSourceFactory,
        }),
      ],
    };
  }
}

const getDataSourceOptions = (
  config: ConfigService<App.Configuration>,
  dataSourceName: string,
  parseConnectionStringFactory?: ParseConnectionStringFactory,
): DataSourceOptions => {
  const dataSourceConfig =
    (config.get('dataSources', { infer: true }) ?? {})[dataSourceName] ?? {};
  const { connectionString, ...restDataSourceConfig } = dataSourceConfig;
  return parseConnectionStringFactory
    ? mergeObject(parseConnectionStringFactory(dataSourceConfig), {
        ...restDataSourceConfig,
        name: dataSourceName,
      })
    : (restDataSourceConfig as DataSourceOptions);
};

export type DataSourceToken = DataSource | DataSourceOptions | string;

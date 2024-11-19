import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import {
  DataSource,
  DataSourceOptions,
  EntitySchema,
  MixedList,
} from 'typeorm';
import { ConfigurationModule } from '../../configuration';
import { DatabaseModule, DatabaseModuleOptions } from '../database.module';
import { ApplyMigrationsCommand } from './commands/apply-migrations.command';
import { GenerateMigrationCommand } from './commands/generate-migration.command';
import { RevertMigrationCommand } from './commands/revert-migration.command';
import { MigrationsFactory } from './factories/migrations-factory';
import { GenerateMigrationCommandOptions } from './interfaces/migrations-command-options';
import { GENERATE_MIGRATION_OPTIONS } from './tokens/generate-migration-options.token';

export interface DatabaseMigrationsModuleOptions {
  config: App.Configuration;
  dataSource: MigrationsDataSource;
  generateOptions?: GenerateMigrationCommandOptions;
}

export interface MigrationsDataSource extends DatabaseModuleOptions {
  dataSourceOptions: {
    entities: MixedList<Type<any> | string | EntitySchema>;
    migrations: MixedList<Type<any> | string>;
    migrationsTableName?: string;
  };
}

@Module({})
export class DatabaseMigrationsModule {
  public static forRoot(
    options: DatabaseMigrationsModuleOptions,
  ): DynamicModule {
    const databaseOptions: DatabaseModuleOptions = {
      ...options.dataSource,
      dataSourceOptions: {
        ...options.dataSource.dataSourceOptions,
        synchronize: false,
        migrationsRun: false,
        dropSchema: false,
        logging: ['error'],
      },
      dataSourceFactory: async (options?: DataSourceOptions) => {
        let dataSource: DataSource;
        try {
          dataSource = new DataSource(options!);
          await dataSource.initialize();
        } catch (error: any) {
          try {
            const temporaryDataSource = new DataSource({
              ...options!,
              database: '',
            } as any);

            await temporaryDataSource.initialize();

            const queryRunner = temporaryDataSource.createQueryRunner();
            await queryRunner.query(`CREATE DATABASE ${options!.database}`);
            await queryRunner.release();

            await temporaryDataSource.destroy();

            dataSource = new DataSource(options!);
          } catch {
            throw error;
          }
        }
        return dataSource;
      },
    };

    const providers: Provider[] = [
      {
        provide: GENERATE_MIGRATION_OPTIONS,
        useValue: options.generateOptions ?? {},
      },
      MigrationsFactory,
      GenerateMigrationCommand,
      ApplyMigrationsCommand,
      RevertMigrationCommand,
    ];

    if (options.dataSource.dataSourceName) {
      providers.push({
        provide: getDataSourceToken(),
        useExisting: getDataSourceToken(options.dataSource.dataSourceName),
      });
    }

    return {
      module: DatabaseMigrationsModule,
      imports: [
        ConfigurationModule.forRoot({ config: options.config }),
        DatabaseModule.forRoot(databaseOptions),
      ],
      providers: providers,
    };
  }
}

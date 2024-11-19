import { Inject, Injectable } from '@nestjs/common';
import { stripEndSlash } from '@nestjs/common/utils/shared.utils';
import { format } from '@sqltools/formatter/lib/sqlFormatter';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { CommandUtils } from 'typeorm/commands/CommandUtils';
import { camelCase } from 'typeorm/util/StringUtils';
import { GenerateMigrationCommandOptions } from '../interfaces/migrations-command-options';
import { GENERATE_MIGRATION_OPTIONS } from '../tokens/generate-migration-options.token';

export interface GenerateMigrationOptions extends GenerateMigrationCommandOptions {
  migrationName: string;
  dataSource: DataSource;
}

@Injectable()
export class MigrationsFactory {
  constructor(
    @Inject(GENERATE_MIGRATION_OPTIONS)
    protected readonly generateOptions: GenerateMigrationCommandOptions,
  ) {}

  public async generate(options: GenerateMigrationOptions): Promise<void> {
    const dataSource = options.dataSource;

    try {
      const timestamp = CommandUtils.getTimestamp(null);
      const extension = options.outputJs ? '.js' : this.generateOptions.outputJs ? '.js' : '.ts';
      const migrationDir =
        options.migrationDir || this.generateOptions.migrationDir || 'migrations';
      const migrationPwd = stripEndSlash(
        migrationDir.startsWith(path.sep)
          ? migrationDir
          : path.resolve(process.cwd(), migrationDir),
      );
      const migrationName = options.migrationName || 'undefinedMigration';
      const migrationFilePath = path.join(
        migrationPwd,
        timestamp + '_' + migrationName + extension,
      );

      const upSqls: string[] = [];
      const downSqls: string[] = [];

      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const sqlInMemory = await dataSource.driver.createSchemaBuilder().log();

      sqlInMemory.upQueries.forEach(upQuery => {
        upQuery.query = this.prettifyQuery(upQuery.query);
        upSqls.push(
          '        await queryRunner.query(`' +
            upQuery.query.replace(new RegExp('`', 'g'), '\\`') +
            '`' +
            this.queryParams(upQuery.parameters) +
            ');',
        );
      });

      sqlInMemory.downQueries.forEach(downQuery => {
        downQuery.query = this.prettifyQuery(downQuery.query);
        downSqls.push(
          '        await queryRunner.query(`' +
            downQuery.query.replace(new RegExp('`', 'g'), '\\`') +
            '`' +
            this.queryParams(downQuery.parameters) +
            ');',
        );
      });

      if (!upSqls.length) {
        console.warn(`No changes in database schema were found - cannot generate a migration.`);
        process.exit();
      }

      const fileContent = options.outputJs
        ? this.getJavascriptTemplate(migrationName, timestamp, upSqls, downSqls.reverse())
        : this.getTemplate(migrationName, timestamp, upSqls, downSqls.reverse());

      await CommandUtils.createFile(migrationFilePath, fileContent);

      console.log(`Migration ${migrationName} has been generated successfully.`);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    }
  }

  protected getTemplate(
    name: string,
    timestamp: number,
    upSqls: string[],
    downSqls: string[],
  ): string {
    const migrationName = `${camelCase(name, true)}${timestamp}`;

    return `import { MigrationInterface, QueryRunner } from "typeorm";

export class ${migrationName} implements MigrationInterface {
    name = '${migrationName}'

    public async up(queryRunner: QueryRunner): Promise<void> {
${upSqls.join(`
`)}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
${downSqls.join(`
`)}
    }
}
`;
  }

  protected getJavascriptTemplate(
    name: string,
    timestamp: number,
    upSqls: string[],
    downSqls: string[],
  ): string {
    const migrationName = `${camelCase(name, true)}${timestamp}`;

    return `const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ${migrationName} {
    name = '${migrationName}'

    async up(queryRunner) {
${upSqls.join(`
`)}
    }

    async down(queryRunner) {
${downSqls.join(`
`)}
    }
}
`;
  }

  protected queryParams(parameters: any[] | undefined): string {
    if (!parameters || !parameters.length) {
      return '';
    }

    return `, ${JSON.stringify(parameters)}`;
  }

  protected prettifyQuery(query: string): string {
    const formattedQuery = format(query, { indent: '    ' });
    return '\n' + formattedQuery.replace(/^/gm, '            ') + '\n        ';
  }
}

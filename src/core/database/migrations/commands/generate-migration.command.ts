import { InjectDataSource } from '@nestjs/typeorm';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource } from 'typeorm';
import { toBoolean } from '../../../../utils/boolean.util';
import { MigrationsFactory } from '../factories/migrations-factory';
import { GenerateMigrationCommandOptions } from '../interfaces/migrations-command-options';

@Command({
  name: 'generate-migration',
  description: 'Generate typeorm migration',
  arguments: '<migrationName>',
})
export class GenerateMigrationCommand extends CommandRunner {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
    protected migrationsFactory: MigrationsFactory,
  ) {
    super();
  }

  public async run(
    passedParams: string[],
    options?: GenerateMigrationCommandOptions,
  ): Promise<void> {
    const migrationName = passedParams[0];
    await this.migrationsFactory.generate({
      migrationName,
      dataSource: this.dataSource,
      ...options,
    });
  }

  @Option({
    flags: '-o, --migration-dir [migrationDir]',
    description: 'Migration directory',
  })
  public parseMigrationDir(val: string): string {
    return val;
  }

  @Option({
    flags: '-js, --output-js [outputJs]',
    description: 'Output javascript migration file',
    defaultValue: true,
  })
  public parseOutputJs(val: string): boolean {
    return toBoolean(val);
  }
}

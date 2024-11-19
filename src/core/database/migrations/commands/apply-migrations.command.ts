import { InjectDataSource } from '@nestjs/typeorm';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource } from 'typeorm';
import { toBoolean } from '../../../../utils/boolean.util';
import { ApplyMigrationsCommandOptions } from '../interfaces/migrations-command-options';

@Command({
  name: 'apply-migrations',
  description: 'Apply typeorm migrations',
})
export class ApplyMigrationsCommand extends CommandRunner {
  constructor(@InjectDataSource() protected dataSource: DataSource) {
    super();
  }

  public async run(
    passedParams: string[],
    options?: ApplyMigrationsCommandOptions,
  ): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      const migrationsOptions = {
        transaction:
          options?.transaction ??
          this.dataSource.options.migrationsTransactionMode ??
          'all',
        fake: options?.fake,
      };
      const pendingMigrations =
        await this.dataSource.runMigrations(migrationsOptions);
      console.log(`Applied ${pendingMigrations.length} pending migrations.`);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
      }
    }
  }

  @Option({
    flags: '-t, --transaction [transaction]',
    description:
      'Indicates if transaction should be used or not for migrations. Enabled by default.',
  })
  public parseTransaction(val: string): string {
    switch (val) {
      case 'none':
      case 'false':
        val = 'none';
        break;
    }
    return val;
  }

  @Option({
    flags: '-f, --fake [fake]',
    description: 'Fakes reverting the migration',
    defaultValue: false,
  })
  public parseOutputJs(val: string): boolean {
    return toBoolean(val);
  }
}

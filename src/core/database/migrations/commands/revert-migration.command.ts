import { InjectDataSource } from '@nestjs/typeorm';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource } from 'typeorm';
import { toBoolean } from '../../../../utils/boolean.util';
import { RevertMigrationCommandOptions } from '../interfaces/migrations-command-options';

@Command({
  name: 'revert-migration',
  description: 'Revert typeorm migration',
})
export class RevertMigrationCommand extends CommandRunner {
  constructor(@InjectDataSource() protected dataSource: DataSource) {
    super();
  }

  public async run(
    passedParams: string[],
    options?: RevertMigrationCommandOptions,
  ): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      const revertOptions = {
        transaction:
          options?.transaction ??
          this.dataSource.options.migrationsTransactionMode ??
          'all',
        fake: options?.fake,
      };
      await this.dataSource.undoLastMigration(revertOptions);
      console.log('Revert last migration successfully.');
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
      'Indicates if transaction should be used or not for migration revert. Enabled by default.',
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

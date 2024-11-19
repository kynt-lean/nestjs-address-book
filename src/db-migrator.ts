import { Module } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { join } from 'path';
import { config } from './app/app.config';
import { EntityChangeSchema } from './app/audit-logging/schemas/entity-change.schema';
import { EntityPropertyChangeSchema } from './app/audit-logging/schemas/entity-property-change.schema';
import { LocationSchema } from './app/locations/schemas/location.schema';
import { DatabaseMigrationsModule } from './core/database/migrations/database-migrations.module';
import { parsePostgresConnectionString } from './utils/pg.util';

const migrationDir = `assets/migrations`;

@Module({
  imports: [
    DatabaseMigrationsModule.forRoot({
      config: config,
      dataSource: {
        dataSourceOptions: {
          entities: [
            EntityChangeSchema,
            EntityPropertyChangeSchema,
            LocationSchema,
          ],
          migrations: [join(process.cwd(), `${migrationDir}/**/*.js`)],
        },
        parseConnectionStringFactory: parsePostgresConnectionString,
      },
      generateOptions: { migrationDir: join(process.cwd(), migrationDir) },
    }),
  ],
})
export class DbMigratorModule {}

async function bootstrap(): Promise<void> {
  await CommandFactory.run(DbMigratorModule, { logger: ['error'] });
}

bootstrap();

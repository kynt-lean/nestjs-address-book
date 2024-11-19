export interface GenerateMigrationCommandOptions {
  migrationDir?: string;
  outputJs?: boolean;
}

export interface RevertMigrationCommandOptions {
  transaction?: 'all' | 'none' | 'each';
  fake?: boolean;
}

export interface ApplyMigrationsCommandOptions {
  transaction?: 'all' | 'none' | 'each';
  fake?: boolean;
}

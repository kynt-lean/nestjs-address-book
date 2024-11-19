export * from './database.module';

declare global {
  namespace App {
    interface Configuration {
      dataSources?: {
        [key: string]: DataSourceConfiguration;
      };
    }

    interface DataSourceConfiguration {
      /**
       * Connection string should be parsed with appropriate dbms provider.
       */
      connectionString?: string;
      /**
       * Connection timeout in ms (default: 15000).
       */
      connectionTimeout?: number;
    }
  }
}

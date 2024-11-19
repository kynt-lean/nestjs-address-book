# Project Overview

## How to Run the Project

- **Development Environment**: Ensure the development environment is set up by running:
  ```bash
  docker-compose -f dev/docker-compose.dev.yml up -d
  ```
- **Database Migration**: Migrate the database using:
  ```bash
  npm run applymigrations
  ```

## Application Components

- **Tracer with OpenTelemetry**: Integrates OpenTelemetry for distributed tracing.
- **Logging with Pino**: Utilizes Pino for efficient logging.
- **Configuration**: Supports merging process environment variables using `__` as a separator.
- **TypeORM DataSource Options**: Enhanced configuration support for TypeORM data sources.
- **Command Factory**: Utility for generating database migrations, applying migrations, and reverting migrations.
- **Authentication**: Easily declare authentication chains in parallel or sequentially, with support for mapping the current user after successful authentication.
- **Validation Pipes**: Supports data transformation and normalization, such as converting to boolean or Date types, while ensuring input data validation.
- **Exception Handlers**: Standardizes error objects returned from HTTP responses.
- **Audit-Logging Infrastructure**: Allows setting creator, creationTime, lastModifier, lastModificationTime, deleter, and deletionTime (for soft deletes), as well as tracking entity property changes.

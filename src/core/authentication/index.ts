export * from './authentication.module';

declare global {
  namespace Express {
    interface User extends Record<string, any> {}
  }
}

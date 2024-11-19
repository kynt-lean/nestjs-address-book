export const config: App.Configuration = {
  dataSources: {
    default: {
      connectionString:
        'postgresql://username:password@localhost:5432/mydatabase',
      connectionTimeout: 3000,
    },
  },
};

declare global {
  namespace App {
    interface Configuration {
      http?: HttpConfiguration;
      protection?: ProtectionConfiguration;
    }

    interface HttpConfiguration {
      url?: string;
      port?: number;
      globalPrefix?: string;
      allowedOrigins?: string[];
      pfx?: string;
      passphrase?: string;
      cert?: string;
      key?: string;
      ca?: string;
      crl?: string;
      ciphers?: string;
    }

    interface ProtectionConfiguration {
      stringEncryption: {
        passphrase: string;
      };
    }
  }
}

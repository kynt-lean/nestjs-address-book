import { DynamicModule, Module } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { camelCase } from '../../utils/change-case.util';
import {
  createRecursiveObject,
  isObjectProp,
  mergeObject,
} from '../../utils/object.util';
import { specialStringMapper } from '../../utils/string.util';

export interface ConfigurationModuleOptions extends ConfigModuleOptions {
  config?: App.Configuration;
}

@Module({})
export class ConfigurationModule {
  public static async forRoot(
    options: ConfigurationModuleOptions = {},
  ): Promise<DynamicModule> {
    const configModule = await ConfigModule.forRoot({
      ...options,
      load: [
        ...(options.load ?? []),
        (): App.Configuration => getConfiguration(options.config),
      ],
      isGlobal: isNil(options.isGlobal) ? true : options.isGlobal,
    });
    return {
      module: ConfigurationModule,
      imports: [configModule],
      exports: [configModule],
    };
  }
}

const getConfiguration = (config: App.Configuration = {}): App.Configuration =>
  mergeObject(config, parseEnvironments(config));

const parseEnvironments = (config: App.Configuration): App.Configuration => {
  const parsedObj: Record<string, unknown> = {};
  const env = process.env;
  const envObj: Record<string, unknown> = {};

  Object.entries(env).forEach(([key, value]) => {
    const propPath = splitEnviroment(key).map((v) => camelCase(v));
    if (value) {
      createRecursiveObject(propPath, value, envObj);
    }
  });

  for (const prop in config) {
    const configPropValue = config[prop as keyof App.Configuration];
    if (isObjectProp(envObj, camelCase(prop))) {
      parsedObj[prop] = castEnvironmentValue(
        envObj[camelCase(prop)],
        configPropValue,
      );
    }
  }

  for (const ext in envObj) {
    if (!isObjectProp(config, ext)) {
      parsedObj[ext] = envObj[ext];
    }
  }

  return parsedObj;
};

const splitEnviroment = (variable: string): string[] =>
  variable.split(/__/g).filter((v) => v != null);

const castEnvironmentValue = (env: any, origin: any): any => {
  if (typeof origin === 'object') {
    const isArrayOrigin = Array.isArray(origin);
    let result: any;

    if (isArrayOrigin) {
      if (typeof env === 'string') {
        result = env.split(/[,;]/).map((str) => str.trim());
      }
      if (typeof env === 'object') {
        result = [];
        for (const key in env) {
          result.push(env[key]);
        }
      }
    } else {
      if (env) {
        result = {};
        for (const key in env) {
          result[key] = isObjectProp(env, key)
            ? castEnvironmentValue(env[key], origin[key])
            : env[key];
        }
      }
    }

    return result;
  }

  if (typeof env === 'string') {
    env = specialStringMapper.get(env) ?? env;
  }

  switch (typeof origin) {
    case 'number':
    case 'bigint':
      return +env;

    case 'boolean':
      return !!env;

    default:
      return env;
  }
};

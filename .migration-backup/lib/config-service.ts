import devConfig from '../configs/dev.json';
import prodConfig from '../configs/prod.json';

export type AppConfig = typeof devConfig;

class ConfigService {
  private static instance: ConfigService;
  private currentConfig: AppConfig;

  private constructor() {
    const env = process.env.NEXT_PUBLIC_APP_ENV || 'development';
    this.currentConfig = env === 'production' ? (prodConfig as AppConfig) : (devConfig as AppConfig);
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getConfig(): AppConfig {
    return this.currentConfig;
  }

  public getFeatureFlag(key: keyof AppConfig['FEATURE_FLAGS']): boolean {
    return this.currentConfig.FEATURE_FLAGS[key];
  }
}

export const configService = ConfigService.getInstance();

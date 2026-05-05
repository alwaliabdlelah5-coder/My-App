import { createClient, SupabaseClient } from '@supabase/supabase-js';
import systemConfig from '../config/system-config.json';

export interface ConfigValue {
  key: string;
  value: any;
  category: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'color';
  validation_rules?: Record<string, any>;
  updated_at: string;
}

export interface ConfigProfile {
  id: string;
  name: string;
  type: 'local' | 'cloud' | 'hybrid' | 'offline_sync';
  settings: Record<string, any>;
  is_active: boolean;
}

export class ConfigurationService {
  private static instance: ConfigurationService;
  private config: any = systemConfig;
  private supabase: SupabaseClient | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private cache: Map<string, ConfigValue> = new Map();
  private syncEnabled = false;

  private constructor() {
    this.initializeSupabase();
    this.loadConfig();
  }

  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  private initializeSupabase(): void {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: false,
          },
        });
        this.syncEnabled = true;
      }
    } catch (error) {
      console.error('[ConfigService] خطأ في تهيئة Supabase:', error);
    }
  }

  private loadConfig(): void {
    // تحميل التكوين من الملف المضمن أولاً
    this.config = systemConfig;

    // محاولة تحميل الإعدادات من قاعدة البيانات إن كانت متاحة
    if (this.syncEnabled) {
      this.loadConfigFromDatabase();
    }
  }

  private async loadConfigFromDatabase(): Promise<void> {
    if (!this.supabase) return;

    try {
      const { data, error } = await this.supabase
        .from('config_settings')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      if (data) {
        for (const setting of data) {
          this.cache.set(setting.key, {
            key: setting.key,
            value: setting.value,
            category: setting.category,
            type: setting.type,
            validation_rules: setting.validation_rules,
            updated_at: setting.updated_at,
          });
        }
      }
    } catch (error) {
      console.error('[ConfigService] خطأ في تحميل الإعدادات من قاعدة البيانات:', error);
    }
  }

  // الحصول على قيمة إعداد
  public getValue(path: string, defaultValue: any = null): any {
    // أولاً تحقق من الكاش
    if (this.cache.has(path)) {
      return this.cache.get(path)?.value;
    }

    // ثم من التكوين المضمن
    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  // تعيين قيمة إعداد
  public async setValue(key: string, value: any, category: string = 'general'): Promise<boolean> {
    try {
      // تحديث الكاش المحلي
      this.cache.set(key, {
        key,
        value,
        category,
        type: typeof value === 'object' ? 'json' : typeof value as any,
        updated_at: new Date().toISOString(),
      });

      // تحديث التكوين المحلي
      const keys = key.split('.');
      const blockedKeys = new Set(['__proto__', 'prototype', 'constructor']);
      if (keys.length === 0 || keys.some((k) => !k || blockedKeys.has(k))) {
        console.warn(`[ConfigService] مفتاح إعداد غير آمن أو غير صالح: ${key}`);
        return false;
      }

      let obj = this.config;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in obj)) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;

      // حفظ في قاعدة البيانات إن كانت متاحة
      if (this.supabase) {
        const { error } = await this.supabase
          .from('config_settings')
          .upsert(
            {
              key,
              value,
              category,
              type: typeof value === 'object' ? 'json' : typeof value,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
          );

        if (error) throw error;
      }

      // إخطار المستمعين
      this.notifyListeners(key);

      return true;
    } catch (error) {
      console.error(`[ConfigService] خطأ في تعيين القيمة ${key}:`, error);
      return false;
    }
  }

  // الاستماع لتغييرات معينة
  public subscribe(path: string, callback: Function): void {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    this.listeners.get(path)!.add(callback);
  }

  // إلغاء الاستماع
  public unsubscribe(path: string, callback: Function): void {
    if (this.listeners.has(path)) {
      this.listeners.get(path)!.delete(callback);
    }
  }

  // إخطار المستمعين بالتغييرات
  private notifyListeners(path: string): void {
    const value = this.getValue(path);

    if (this.listeners.has(path)) {
      this.listeners.get(path)!.forEach((callback) => {
        try {
          callback(value);
        } catch (error) {
          console.error(`[ConfigService] خطأ في استدعاء المستمع:`, error);
        }
      });
    }

    // تنبيه المستمعين للمسارات الأب
    const parts = path.split('.');
    for (let i = parts.length - 1; i > 0; i--) {
      const parentPath = parts.slice(0, i).join('.');
      if (this.listeners.has(parentPath)) {
        const parentValue = this.getValue(parentPath);
        this.listeners.get(parentPath)!.forEach((callback) => {
          try {
            callback(parentValue);
          } catch (error) {
            console.error(`[ConfigService] خطأ في استدعاء المستمع الأب:`, error);
          }
        });
      }
    }
  }

  // الحصول على ملف تعريفي للقاعدة البيانات
  public getDatabaseProfile(profileId: string): ConfigProfile | null {
    const profiles = this.getValue('database_config_filter.profiles', []);
    return profiles.find((p: any) => p.id === profileId) || null;
  }

  // الحصول على الملف التعريفي النشط
  public getActiveDatabaseProfile(): ConfigProfile | null {
    const activeProfileId = this.getValue('database_config_filter.active_profile');
    return this.getDatabaseProfile(activeProfileId);
  }

  // التحقق من أن ميزة مفعلة
  public isFeatureEnabled(featureName: string): boolean {
    return this.getValue(`${featureName}.enabled`, false);
  }

  // الحصول على جميع الإعدادات في فئة معينة
  public async getCategory(category: string): Promise<ConfigValue[]> {
    const results: ConfigValue[] = [];

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('config_settings')
          .select('*')
          .eq('category', category);

        if (error) throw error;
        if (data) return data;
      } catch (error) {
        console.error(`[ConfigService] خطأ في جلب فئة ${category}:`, error);
      }
    }

    return results;
  }

  // تصدير التكوين
  public exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  // استيراد التكوين
  public async importConfig(configJson: string): Promise<boolean> {
    try {
      const newConfig = JSON.parse(configJson);
      this.config = { ...this.config, ...newConfig };

      // حفظ في قاعدة البيانات
      if (this.supabase) {
        // يمكن تنفيذ منطق الحفظ الشامل هنا
      }

      this.notifyListeners('*');
      return true;
    } catch (error) {
      console.error('[ConfigService] خطأ في استيراد التكوين:', error);
      return false;
    }
  }
}

// تصدير نسخة منفردة
export const configService = ConfigurationService.getInstance();

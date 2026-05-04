import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { configService } from './configuration.service';

export interface DatabaseConnection {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  url?: string;
  type: 'local' | 'cloud' | 'hybrid' | 'offline';
}

export interface DatabaseQuery {
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  data?: any;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private primaryConnection: SupabaseClient | null = null;
  private secondaryConnection: SupabaseClient | null = null;
  private connectionProfile: any = null;
  private isOffline = false;
  private localCache: Map<string, any[]> = new Map();

  private constructor() {
    this.initializeConnections();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initializeConnections(): void {
    try {
      const activeProfile = configService.getActiveDatabaseProfile();

      if (!activeProfile) {
        console.warn('[DatabaseManager] لم يتم العثور على ملف تعريفي نشط');
        this.isOffline = true;
        return;
      }

      this.connectionProfile = activeProfile;

      switch (activeProfile.type) {
        case 'cloud':
          this.initializeCloudConnection(activeProfile);
          break;
        case 'local':
          this.initializeLocalConnection(activeProfile);
          break;
        case 'hybrid':
          this.initializeHybridConnection(activeProfile);
          break;
        case 'offline_sync':
          this.initializeOfflineSync(activeProfile);
          break;
      }
    } catch (error) {
      console.error('[DatabaseManager] خطأ في تهيئة الاتصالات:', error);
      this.isOffline = true;
    }
  }

  private initializeCloudConnection(profile: any): void {
    try {
      const url = profile.connection_string || profile.settings?.url;
      const apiKey = profile.api_key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !apiKey) {
        console.warn('[DatabaseManager] لا يوجد بيانات اتصال سحابية');
        return;
      }

      this.primaryConnection = createClient(url, apiKey, {
        auth: { persistSession: false },
      });

      console.log('[DatabaseManager] تم الاتصال بقاعدة البيانات السحابية بنجاح');
    } catch (error) {
      console.error('[DatabaseManager] خطأ في الاتصال السحابي:', error);
    }
  }

  private initializeLocalConnection(profile: any): void {
    // في بيئة Node.js، يمكن استخدام مكتبة postgres
    // في بيئة المتصفح، نستخدم Supabase كخادم وسيط
    console.log('[DatabaseManager] تم تهيئة الاتصال المحلي');
  }

  private initializeHybridConnection(profile: any): void {
    const primaryId = profile.settings?.primary;
    const secondaryId = profile.settings?.secondary;

    const primaryProfile = configService.getDatabaseProfile(primaryId);
    const secondaryProfile = configService.getDatabaseProfile(secondaryId);

    if (primaryProfile) {
      if (primaryProfile.type === 'cloud') {
        this.initializeCloudConnection(primaryProfile);
      }
    }

    if (secondaryProfile) {
      if (secondaryProfile.type === 'cloud') {
        this.initializeSecondaryConnection(secondaryProfile);
      }
    }

    console.log('[DatabaseManager] تم تهيئة الاتصال الهجين');
  }

  private initializeSecondaryConnection(profile: any): void {
    try {
      const url = profile.connection_string || profile.settings?.url;
      const apiKey = profile.api_key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !apiKey) return;

      this.secondaryConnection = createClient(url, apiKey, {
        auth: { persistSession: false },
      });

      console.log('[DatabaseManager] تم الاتصال الثانوي بنجاح');
    } catch (error) {
      console.error('[DatabaseManager] خطأ في الاتصال الثانوي:', error);
    }
  }

  private initializeOfflineSync(profile: any): void {
    console.log('[DatabaseManager] تم تهيئة المزامنة دون اتصال');
    // يتم تخزين البيانات محلياً مع مزامنة عند الاتصال
  }

  // تنفيذ استعلام
  public async query(query: DatabaseQuery): Promise<any> {
    try {
      // اختيار الاتصال المناسب بناءً على نوع الجدول
      const connection = this.getConnectionForTable(query.table);

      if (!connection) {
        console.warn(`[DatabaseManager] لا يوجد اتصال متاح للجدول ${query.table}`);
        return this.getFromCache(query.table);
      }

      let result: any;

      switch (query.operation) {
        case 'select':
          result = await this.executeSelect(connection, query);
          break;
        case 'insert':
          result = await this.executeInsert(connection, query);
          break;
        case 'update':
          result = await this.executeUpdate(connection, query);
          break;
        case 'delete':
          result = await this.executeDelete(connection, query);
          break;
      }

      // تخزين في الكاش المحلي
      if (query.operation === 'select') {
        this.localCache.set(query.table, result.data);
      }

      return result;
    } catch (error) {
      console.error(`[DatabaseManager] خطأ في الاستعلام على ${query.table}:`, error);

      // محاولة الحصول على البيانات من الكاش عند الفشل
      if (query.operation === 'select') {
        return { data: this.getFromCache(query.table), error: error };
      }

      return { data: null, error };
    }
  }

  private async executeSelect(conn: SupabaseClient, q: DatabaseQuery): Promise<any> {
    let query = conn.from(q.table).select('*');

    if (q.filters) {
      Object.entries(q.filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'object') {
          // معالجة الفلاتر المعقدة
          Object.entries(value).forEach(([op, val]) => {
            if (op === 'gte') query = query.gte(key, val);
            if (op === 'lte') query = query.lte(key, val);
            if (op === 'gt') query = query.gt(key, val);
            if (op === 'lt') query = query.lt(key, val);
            if (op === 'like') query = query.like(key, val as string);
          });
        } else {
          query = query.eq(key, value);
        }
      });
    }

    if (q.limit) query = query.limit(q.limit);
    if (q.offset) query = query.range(q.offset, q.offset + (q.limit || 10) - 1);

    return await query;
  }

  private async executeInsert(conn: SupabaseClient, q: DatabaseQuery): Promise<any> {
    return await conn.from(q.table).insert(q.data).select();
  }

  private async executeUpdate(conn: SupabaseClient, q: DatabaseQuery): Promise<any> {
    let query = conn.from(q.table).update(q.data);

    if (q.filters) {
      Object.entries(q.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    return await query.select();
  }

  private async executeDelete(conn: SupabaseClient, q: DatabaseQuery): Promise<any> {
    let query = conn.from(q.table).delete();

    if (q.filters) {
      Object.entries(q.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    return await query;
  }

  private getConnectionForTable(tableName: string): SupabaseClient | null {
    if (!this.connectionProfile) return null;

    if (this.connectionProfile.type === 'hybrid' && this.connectionProfile.settings?.routing) {
      const routing = this.connectionProfile.settings.routing[tableName];

      if (routing === 'primary') return this.primaryConnection;
      if (routing === 'secondary') return this.secondaryConnection;
    }

    return this.primaryConnection || this.secondaryConnection;
  }

  private getFromCache(tableName: string): any[] {
    return this.localCache.get(tableName) || [];
  }

  public setCache(tableName: string, data: any[]): void {
    this.localCache.set(tableName, data);
  }

  public clearCache(): void {
    this.localCache.clear();
  }

  public isConnected(): boolean {
    return !this.isOffline && (!!this.primaryConnection || !!this.secondaryConnection);
  }

  public getConnectionInfo(): string {
    if (!this.connectionProfile) return 'غير متصل';

    return `${this.connectionProfile.type}: ${this.connectionProfile.name || 'بدون اسم'}`;
  }
}

export const databaseManager = DatabaseManager.getInstance();

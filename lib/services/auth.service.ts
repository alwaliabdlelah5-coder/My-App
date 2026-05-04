import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { databaseManager, DatabaseQuery } from './database.manager';
import { configService } from './configuration.service';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  full_name: string;
  roles: string[];
  permissions: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
  mfaCode?: string;
}

export class AuthenticationService {
  private static instance: AuthenticationService;
  private jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  private refreshTokens: Map<string, string> = new Map();
  private currentUser: UserInfo | null = null;

  private constructor() {}

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  /**
   * تسجيل الدخول
   */
  public async login(credentials: LoginCredentials): Promise<AuthToken | null> {
    try {
      // جلب بيانات المستخدم من قاعدة البيانات
      const result = await databaseManager.query({
        table: 'users',
        operation: 'select',
        filters: { username: credentials.username },
      });

      const user = result.data?.[0];

      if (!user) {
        console.error('[AuthService] لم يتم العثور على المستخدم');
        return null;
      }

      // تحقق من كلمة المرور
      const passwordValid = await bcrypt.compare(credentials.password, user.password_hash);

      if (!passwordValid) {
        console.error('[AuthService] كلمة مرور غير صحيحة');
        return null;
      }

      // تحقق من MFA إن كانت مفعلة
      if (user.mfa_enabled) {
        if (!this.verifyMfaCode(user.mfa_secret, credentials.mfaCode)) {
          console.error('[AuthService] رمز MFA غير صحيح');
          return null;
        }
      }

      // جلب الأدوار والصلاحيات
      const roles = await this.getUserRoles(user.id);
      const permissions = await this.getUserPermissions(user.id);

      const userInfo: UserInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        roles,
        permissions,
      };

      // إنشاء التوكنات
      const tokens = this.generateTokens(userInfo);

      // حفظ في قاعدة البيانات
      await databaseManager.query({
        table: 'users',
        operation: 'update',
        data: { last_login: new Date().toISOString() },
        filters: { id: user.id },
      });

      this.currentUser = userInfo;

      return tokens;
    } catch (error) {
      console.error('[AuthService] خطأ في تسجيل الدخول:', error);
      return null;
    }
  }

  /**
   * تسجيل الخروج
   */
  public logout(): void {
    if (this.currentUser) {
      this.refreshTokens.delete(this.currentUser.username);
      this.currentUser = null;
    }
  }

  /**
   * تجديد التوكن
   */
  public async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecret) as any;

      const userResult = await databaseManager.query({
        table: 'users',
        operation: 'select',
        filters: { id: decoded.userId },
      });

      const user = userResult.data?.[0];

      if (!user) return null;

      const roles = await this.getUserRoles(user.id);
      const permissions = await this.getUserPermissions(user.id);

      const userInfo: UserInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        roles,
        permissions,
      };

      const newAccessToken = jwt.sign(
        { userId: user.id, username: user.username },
        this.jwtSecret,
        { expiresIn: '1h' }
      );

      return newAccessToken;
    } catch (error) {
      console.error('[AuthService] خطأ في تجديد التوكن:', error);
      return null;
    }
  }

  /**
   * التحقق من التوكن
   */
  public verifyToken(token: string): UserInfo | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;

      if (this.currentUser && this.currentUser.id === decoded.userId) {
        return this.currentUser;
      }

      return null;
    } catch (error) {
      console.error('[AuthService] توكن غير صالح:', error);
      return null;
    }
  }

  /**
   * الحصول على بيانات المستخدم الحالي
   */
  public getCurrentUser(): UserInfo | null {
    return this.currentUser;
  }

  /**
   * التحقق من صلاحية معينة
   */
  public hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }

  /**
   * التحقق من أحد الأدوار
   */
  public hasRole(role: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.roles.includes(role);
  }

  /**
   * جلب أدوار المستخدم
   */
  private async getUserRoles(userId: number): Promise<string[]> {
    try {
      const result = await databaseManager.query({
        table: 'user_roles',
        operation: 'select',
        filters: { user_id: userId },
      });

      const roleIds = result.data?.map((r: any) => r.role_id) || [];

      if (roleIds.length === 0) return [];

      const rolesResult = await databaseManager.query({
        table: 'roles',
        operation: 'select',
        filters: { id: { in: roleIds } },
      });

      return rolesResult.data?.map((r: any) => r.name) || [];
    } catch (error) {
      console.error('[AuthService] خطأ في جلب الأدوار:', error);
      return [];
    }
  }

  /**
   * جلب صلاحيات المستخدم
   */
  private async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const rolesResult = await databaseManager.query({
        table: 'user_roles',
        operation: 'select',
        filters: { user_id: userId },
      });

      const roleIds = rolesResult.data?.map((r: any) => r.role_id) || [];

      if (roleIds.length === 0) return [];

      const permissionsResult = await databaseManager.query({
        table: 'role_permissions',
        operation: 'select',
        filters: { role_id: { in: roleIds } },
      });

      const permissionIds = permissionsResult.data?.map((p: any) => p.permission_id) || [];

      if (permissionIds.length === 0) return [];

      const result = await databaseManager.query({
        table: 'permissions',
        operation: 'select',
        filters: { id: { in: permissionIds } },
      });

      return result.data?.map((p: any) => p.name) || [];
    } catch (error) {
      console.error('[AuthService] خطأ في جلب الصلاحيات:', error);
      return [];
    }
  }

  /**
   * إنشاء التوكنات
   */
  private generateTokens(user: UserInfo): AuthToken {
    const jwtConfig = configService.getValue('permissions.jwt_config', {});

    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },
      this.jwtSecret,
      { expiresIn: `${jwtConfig.expiration_hours || 1}h` }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      this.jwtSecret,
      { expiresIn: `${jwtConfig.refresh_token_expiration_days || 7}d` }
    );

    this.refreshTokens.set(user.username, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: (jwtConfig.expiration_hours || 1) * 3600,
      user,
    };
  }

  /**
   * التحقق من رمز MFA
   */
  private verifyMfaCode(secret: string, code?: string): boolean {
    // يمكن استخدام مكتبة speakeasy أو similar
    // هذا تطبيق مبسط
    if (!code) return false;

    // في بيئة إنتاجية، استخدم مكتبة MFA مناسبة
    return code.length === 6;
  }

  /**
   * تسجيل مستخدم جديد
   */
  public async register(
    username: string,
    email: string,
    password: string,
    full_name: string
  ): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await databaseManager.query({
        table: 'users',
        operation: 'insert',
        data: {
          username,
          email,
          password_hash: hashedPassword,
          full_name,
          is_active: true,
        },
      });

      return result.data && result.data.length > 0;
    } catch (error) {
      console.error('[AuthService] خطأ في التسجيل:', error);
      return false;
    }
  }
}

export const authService = AuthenticationService.getInstance();

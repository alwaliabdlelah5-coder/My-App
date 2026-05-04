import { databaseManager } from './database.manager';

export interface Patient {
  id: number;
  file_number: string;
  full_name: string;
  phone: string;
  email?: string;
  gender?: string;
  birth_date?: string;
  address?: string;
  blood_type?: string;
  allergies?: string;
  chronic_diseases?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  insurance_provider?: string;
  insurance_number?: string;
  registration_date: string;
  is_active: boolean;
}

export interface CreatePatientDto {
  full_name: string;
  phone: string;
  email?: string;
  gender?: string;
  birth_date?: string;
  address?: string;
}

export class PatientsService {
  private static instance: PatientsService;

  private constructor() {}

  public static getInstance(): PatientsService {
    if (!PatientsService.instance) {
      PatientsService.instance = new PatientsService();
    }
    return PatientsService.instance;
  }

  /**
   * الحصول على جميع المرضى
   */
  public async getAllPatients(limit: number = 50, offset: number = 0): Promise<Patient[]> {
    try {
      const result = await databaseManager.query({
        table: 'patients',
        operation: 'select',
        filters: { is_active: true },
        limit,
        offset,
      });

      return result.data || [];
    } catch (error) {
      console.error('[PatientsService] خطأ في جلب المرضى:', error);
      return [];
    }
  }

  /**
   * البحث السريع عن مريض
   */
  public async quickSearch(query: string): Promise<Patient[]> {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      const searchTerm = `%${query}%`;

      // البحث عن الاسم
      const nameResult = await databaseManager.query({
        table: 'patients',
        operation: 'select',
        filters: {
          full_name: { like: searchTerm },
        },
        limit: 8,
      });

      // البحث عن رقم الجوال
      const phoneResult = await databaseManager.query({
        table: 'patients',
        operation: 'select',
        filters: {
          phone: { like: searchTerm },
        },
        limit: 8,
      });

      // البحث عن رقم الملف
      const fileResult = await databaseManager.query({
        table: 'patients',
        operation: 'select',
        filters: {
          file_number: { like: searchTerm },
        },
        limit: 8,
      });

      // دمج النتائج وإزالة التكرار
      const allResults = [...(nameResult.data || []), ...(phoneResult.data || []), ...(fileResult.data || [])];
      const uniqueResults = Array.from(new Map(allResults.map(p => [p.id, p])).values());

      return uniqueResults.slice(0, 8);
    } catch (error) {
      console.error('[PatientsService] خطأ في البحث السريع:', error);
      return [];
    }
  }

  /**
   * جلب مريض بواسطة الرقم
   */
  public async getPatientById(id: number): Promise<Patient | null> {
    try {
      const result = await databaseManager.query({
        table: 'patients',
        operation: 'select',
        filters: { id },
      });

      return result.data?.[0] || null;
    } catch (error) {
      console.error('[PatientsService] خطأ في جلب المريض:', error);
      return null;
    }
  }

  /**
   * جلب مريض برقم الملف
   */
  public async getPatientByFileNumber(fileNumber: string): Promise<Patient | null> {
    try {
      const result = await databaseManager.query({
        table: 'patients',
        operation: 'select',
        filters: { file_number: fileNumber },
      });

      return result.data?.[0] || null;
    } catch (error) {
      console.error('[PatientsService] خطأ في جلب المريض برقم الملف:', error);
      return null;
    }
  }

  /**
   * إنشاء مريض جديد
   */
  public async createPatient(dto: CreatePatientDto): Promise<Patient | null> {
    try {
      // التحقق من عدم تكرار رقم الجوال
      const existingResult = await databaseManager.query({
        table: 'patients',
        operation: 'select',
        filters: { phone: dto.phone },
      });

      if (existingResult.data && existingResult.data.length > 0) {
        console.warn('[PatientsService] المريض بهذا الرقم موجود بالفعل');
        return existingResult.data[0];
      }

      // توليد رقم ملف فريد
      const fileNumber = await this.generateFileNumber();

      const patientData = {
        file_number: fileNumber,
        full_name: dto.full_name,
        phone: dto.phone,
        email: dto.email || null,
        gender: dto.gender || null,
        birth_date: dto.birth_date || null,
        address: dto.address || null,
        is_active: true,
        registration_date: new Date().toISOString(),
      };

      const result = await databaseManager.query({
        table: 'patients',
        operation: 'insert',
        data: patientData,
      });

      return result.data?.[0] || null;
    } catch (error) {
      console.error('[PatientsService] خطأ في إنشاء مريض:', error);
      return null;
    }
  }

  /**
   * تحديث بيانات المريض
   */
  public async updatePatient(id: number, dto: Partial<CreatePatientDto>): Promise<boolean> {
    try {
      const result = await databaseManager.query({
        table: 'patients',
        operation: 'update',
        data: dto,
        filters: { id },
      });

      return !!result.data;
    } catch (error) {
      console.error('[PatientsService] خطأ في تحديث المريض:', error);
      return false;
    }
  }

  /**
   * حذف (إلغاء تنشيط) مريض
   */
  public async deletePatient(id: number): Promise<boolean> {
    try {
      const result = await databaseManager.query({
        table: 'patients',
        operation: 'update',
        data: { is_active: false },
        filters: { id },
      });

      return !!result.data;
    } catch (error) {
      console.error('[PatientsService] خطأ في حذف المريض:', error);
      return false;
    }
  }

  /**
   * توليد رقم ملف فريد
   */
  private async generateFileNumber(): Promise<string> {
    try {
      const result = await databaseManager.query({
        table: 'patients',
        operation: 'select',
      });

      const patientCount = result.data?.length || 0;
      const year = new Date().getFullYear();
      const number = String(patientCount + 1).padStart(6, '0');

      return `${year}-${number}`;
    } catch (error) {
      console.error('[PatientsService] خطأ في توليد رقم الملف:', error);
      return `${Date.now()}`;
    }
  }

  /**
   * جلب إحصائيات المريض
   */
  public async getPatientStats(patientId: number): Promise<any> {
    try {
      // عدد المواعيد
      const appointmentsResult = await databaseManager.query({
        table: 'appointments',
        operation: 'select',
        filters: { patient_id: patientId },
      });

      // عدد السجلات الطبية
      const recordsResult = await databaseManager.query({
        table: 'medical_records',
        operation: 'select',
        filters: { patient_id: patientId },
      });

      // إجمالي الفواتير
      const invoicesResult = await databaseManager.query({
        table: 'invoices',
        operation: 'select',
        filters: { patient_id: patientId },
      });

      return {
        total_appointments: appointmentsResult.data?.length || 0,
        total_medical_records: recordsResult.data?.length || 0,
        total_invoices: invoicesResult.data?.length || 0,
        total_spent: invoicesResult.data?.reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0) || 0,
      };
    } catch (error) {
      console.error('[PatientsService] خطأ في جلب إحصائيات المريض:', error);
      return null;
    }
  }
}

export const patientsService = PatientsService.getInstance();

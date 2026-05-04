import { databaseManager } from './database.manager';
import { configService } from './configuration.service';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  service_id: number;
  appointment_date: string;
  duration_minutes: number;
  status: 'scheduled' | 'waiting' | 'completed' | 'return' | 'cancelled';
  notes?: string;
  total_cost?: number;
  paid_amount?: number;
  payment_method?: string;
}

export interface CreateAppointmentDto {
  patient_id: number;
  doctor_id: number;
  service_id: number;
  appointment_date: string;
  notes?: string;
}

export class AppointmentsService {
  private static instance: AppointmentsService;

  private constructor() {}

  public static getInstance(): AppointmentsService {
    if (!AppointmentsService.instance) {
      AppointmentsService.instance = new AppointmentsService();
    }
    return AppointmentsService.instance;
  }

  /**
   * الحصول على جميع المواعيد
   */
  public async getAllAppointments(filters?: any): Promise<Appointment[]> {
    try {
      const result = await databaseManager.query({
        table: 'appointments',
        operation: 'select',
        filters,
        limit: 100,
      });

      return result.data || [];
    } catch (error) {
      console.error('[AppointmentsService] خطأ في جلب المواعيد:', error);
      return [];
    }
  }

  /**
   * الحصول على مواعيد اليوم
   */
  public async getTodayAppointments(): Promise<Appointment[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      const result = await databaseManager.query({
        table: 'appointments',
        operation: 'select',
        filters: {
          appointment_date: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      return result.data || [];
    } catch (error) {
      console.error('[AppointmentsService] خطأ في جلب مواعيد اليوم:', error);
      return [];
    }
  }

  /**
   * الحصول على مواعيد قادمة
   */
  public async getUpcomingAppointments(minutes: number = 60): Promise<Appointment[]> {
    try {
      const now = new Date();
      const future = new Date(now.getTime() + minutes * 60000);

      const result = await databaseManager.query({
        table: 'appointments',
        operation: 'select',
        filters: {
          appointment_date: {
            gte: now.toISOString(),
            lte: future.toISOString(),
          },
          status: { in: ['scheduled', 'waiting'] },
        },
      });

      return result.data || [];
    } catch (error) {
      console.error('[AppointmentsService] خطأ في جلب المواعيد القادمة:', error);
      return [];
    }
  }

  /**
   * إنشاء موعد جديد
   */
  public async createAppointment(dto: CreateAppointmentDto): Promise<Appointment | null> {
    try {
      // جلب بيانات الخدمة
      const serviceResult = await databaseManager.query({
        table: 'services',
        operation: 'select',
        filters: { id: dto.service_id },
      });

      const service = serviceResult.data?.[0];

      if (!service) {
        console.error('[AppointmentsService] الخدمة غير موجودة');
        return null;
      }

      // حساب التكلفة
      const basePrice = service.base_price;
      const taxPercent = configService.getValue('appointments.cost_calculation.tax_percent', 15);
      const taxAmount = (basePrice * taxPercent) / 100;
      const totalCost = basePrice + taxAmount;

      const appointmentData = {
        patient_id: dto.patient_id,
        doctor_id: dto.doctor_id,
        service_id: dto.service_id,
        appointment_date: dto.appointment_date,
        duration_minutes: service.duration_minutes || 15,
        status: 'scheduled',
        notes: dto.notes,
        total_cost: totalCost,
        paid_amount: 0,
      };

      const result = await databaseManager.query({
        table: 'appointments',
        operation: 'insert',
        data: appointmentData,
      });

      const appointment = result.data?.[0];

      if (appointment) {
        // إضافة إلى قائمة الانتظار
        await this.addToQueue(appointment.id, dto.doctor_id);

        // إرسال تنبيهات
        await this.sendNotifications(appointment);
      }

      return appointment || null;
    } catch (error) {
      console.error('[AppointmentsService] خطأ في إنشاء الموعد:', error);
      return null;
    }
  }

  /**
   * تحديث حالة الموعد
   */
  public async updateAppointmentStatus(
    appointmentId: number,
    status: string
  ): Promise<boolean> {
    try {
      const result = await databaseManager.query({
        table: 'appointments',
        operation: 'update',
        data: { status },
        filters: { id: appointmentId },
      });

      if (result.data) {
        // تحديث قائمة الانتظار إذا لزم الأمر
        if (status === 'completed' || status === 'cancelled') {
          await this.removeFromQueue(appointmentId);
        }
      }

      return !!result.data;
    } catch (error) {
      console.error('[AppointmentsService] خطأ في تحديث الموعد:', error);
      return false;
    }
  }

  /**
   * إضافة إلى قائمة الانتظار
   */
  private async addToQueue(appointmentId: number, doctorId: number): Promise<void> {
    try {
      // جلب الموعد
      const appointmentResult = await databaseManager.query({
        table: 'appointments',
        operation: 'select',
        filters: { id: appointmentId },
      });

      const appointment = appointmentResult.data?.[0];

      if (!appointment) return;

      // جلب عدد المواعيد قبل هذا
      const queueResult = await databaseManager.query({
        table: 'queue_entries',
        operation: 'select',
        filters: {
          doctor_id: doctorId,
          status: 'waiting',
        },
      });

      const positionInQueue = (queueResult.data?.length || 0) + 1;

      // حساب الوقت المقدر للانتظار
      const avgConsultationTime = configService.getValue(
        'queue.waiting_time_estimation.average_consultation_minutes',
        15
      );
      const estimatedWaitMinutes = (positionInQueue - 1) * avgConsultationTime;

      await databaseManager.query({
        table: 'queue_entries',
        operation: 'insert',
        data: {
          appointment_id: appointmentId,
          doctor_id: doctorId,
          priority_level: 1,
          position_in_queue: positionInQueue,
          estimated_wait_minutes: estimatedWaitMinutes,
          status: 'waiting',
        },
      });
    } catch (error) {
      console.error('[AppointmentsService] خطأ في إضافة قائمة الانتظار:', error);
    }
  }

  /**
   * إزالة من قائمة الانتظار
   */
  private async removeFromQueue(appointmentId: number): Promise<void> {
    try {
      await databaseManager.query({
        table: 'queue_entries',
        operation: 'delete',
        filters: { appointment_id: appointmentId },
      });
    } catch (error) {
      console.error('[AppointmentsService] خطأ في إزالة من قائمة الانتظار:', error);
    }
  }

  /**
   * إرسال التنبيهات
   */
  private async sendNotifications(appointment: Appointment): Promise<void> {
    try {
      const notificationConfig = configService.getValue('appointments.notifications', {});

      // جلب بيانات المريض
      const patientResult = await databaseManager.query({
        table: 'patients',
        operation: 'select',
        filters: { id: appointment.patient_id },
      });

      const patient = patientResult.data?.[0];

      if (!patient) return;

      // إرسال SMS إن كانت مفعلة
      if (notificationConfig.sms?.enabled && patient.phone) {
        await this.sendSMS(patient.phone, appointment);
      }

      // إرسال WhatsApp إن كانت مفعلة
      if (notificationConfig.whatsapp?.enabled && patient.phone) {
        await this.sendWhatsApp(patient.phone, appointment);
      }

      // إرسال بريد إلكتروني إن كانت مفعلة
      if (notificationConfig.email?.enabled && patient.email) {
        await this.sendEmail(patient.email, appointment);
      }
    } catch (error) {
      console.error('[AppointmentsService] خطأ في إرسال التنبيهات:', error);
    }
  }

  /**
   * إرسال SMS
   */
  private async sendSMS(phone: string, appointment: Appointment): Promise<void> {
    // يمكن تنفيذ Twilio أو خدمة SMS أخرى هنا
    console.log(`[AppointmentsService] إرسال SMS إلى ${phone} للموعد ${appointment.id}`);
  }

  /**
   * إرسال WhatsApp
   */
  private async sendWhatsApp(phone: string, appointment: Appointment): Promise<void> {
    // يمكن تنفيذ WhatsApp Business API هنا
    console.log(`[AppointmentsService] إرسال WhatsApp إلى ${phone} للموعد ${appointment.id}`);
  }

  /**
   * إرسال بريد إلكتروني
   */
  private async sendEmail(email: string, appointment: Appointment): Promise<void> {
    // يمكن تنفيذ SendGrid أو خدمة بريد أخرى هنا
    console.log(`[AppointmentsService] إرسال بريد إلى ${email} للموعد ${appointment.id}`);
  }

  /**
   * جلب مواعيد المريض
   */
  public async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    try {
      const result = await databaseManager.query({
        table: 'appointments',
        operation: 'select',
        filters: { patient_id: patientId },
      });

      return result.data || [];
    } catch (error) {
      console.error('[AppointmentsService] خطأ في جلب مواعيد المريض:', error);
      return [];
    }
  }

  /**
   * جلب مواعيد الطبيب
   */
  public async getDoctorAppointments(doctorId: number, date?: string): Promise<Appointment[]> {
    try {
      const filters: any = { doctor_id: doctorId };

      if (date) {
        const startOfDay = new Date(date).toISOString();
        const endOfDay = new Date(new Date(date).getTime() + 86400000).toISOString();

        filters.appointment_date = {
          gte: startOfDay,
          lt: endOfDay,
        };
      }

      const result = await databaseManager.query({
        table: 'appointments',
        operation: 'select',
        filters,
      });

      return result.data || [];
    } catch (error) {
      console.error('[AppointmentsService] خطأ في جلب مواعيد الطبيب:', error);
      return [];
    }
  }
}

export const appointmentsService = AppointmentsService.getInstance();

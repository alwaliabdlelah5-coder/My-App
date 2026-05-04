// تصدير جميع الخدمات
export { ConfigurationService, configService } from './configuration.service';
export type { ConfigValue, ConfigProfile } from './configuration.service';

export { DatabaseManager, databaseManager } from './database.manager';
export type { DatabaseConnection, DatabaseQuery } from './database.manager';

export { AuthenticationService, authService } from './auth.service';
export type { AuthToken, UserInfo, LoginCredentials } from './auth.service';

export { AppointmentsService, appointmentsService } from './appointments.service';
export type { Appointment, CreateAppointmentDto } from './appointments.service';

export { PatientsService, patientsService } from './patients.service';
export type { Patient, CreatePatientDto } from './patients.service';

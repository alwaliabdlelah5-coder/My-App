export type Role = 'admin' | 'doctor' | 'nurse' | 'lab_tech' | 'receptionist' | 'pharmacist';

export const ROLE_LABELS: Record<Role, string> = {
  admin:        'مدير النظام',
  doctor:       'طبيب',
  nurse:        'ممرض',
  lab_tech:     'فني مختبر',
  receptionist: 'موظف استقبال',
  pharmacist:   'صيدلاني',
};

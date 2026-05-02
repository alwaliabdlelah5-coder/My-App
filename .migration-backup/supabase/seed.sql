-- إعداد فلاتر التهيئة الافتراضية
INSERT INTO config_settings (key, value) VALUES
('clinic_name', 'مركز العيادة الطبية المتكامل'),
('vat_percent', '15'),
('admin_email', 'admin@medical.ye');

-- إعداد الأدوار الافتراضية
INSERT INTO roles (name) VALUES ('ADMIN'), ('DOCTOR'), ('ACCOUNTANT');

-- إعداد المستخدمين الأساسيين
-- بيانات افتراضية للتطوير
INSERT INTO users (username, full_name, role) VALUES 
('admin', 'المدير العام', 'ADMIN'),
('dr_khaled', 'د. خالد محسن', 'DOCTOR');

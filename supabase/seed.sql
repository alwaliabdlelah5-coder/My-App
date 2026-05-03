-- إنشاء الجداول الأساسية إذا لم تكن موجودة
CREATE TABLE IF NOT EXISTS config_settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT REFERENCES roles(name)
);

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

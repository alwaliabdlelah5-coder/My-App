-- ===========================
-- النظام الطبي المتكامل (IMP)
-- نصوص إنشاء قاعدة البيانات
-- ===========================

-- جداول الإعدادات والتكوين
CREATE TABLE IF NOT EXISTS config_categories (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS config_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category_id INT REFERENCES config_categories(id),
  type VARCHAR(50) DEFAULT 'string',
  validation_rules JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS config_profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  profile_type VARCHAR(50),
  settings JSONB,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS config_audit_log (
  id SERIAL PRIMARY KEY,
  user_id INT,
  config_key VARCHAR(255),
  old_value JSONB,
  new_value JSONB,
  action VARCHAR(50),
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جداول المستخدمين والصلاحيات
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  name_ar VARCHAR(100),
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  module VARCHAR(100),
  action VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

-- جداول المرضى والملفات الطبية
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  file_number VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  gender VARCHAR(20),
  birth_date DATE,
  address TEXT,
  blood_type VARCHAR(10),
  allergies TEXT,
  chronic_diseases TEXT,
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(20),
  insurance_provider VARCHAR(255),
  insurance_number VARCHAR(100),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES patients(id),
  doctor_id INT REFERENCES users(id),
  visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  chief_complaint TEXT,
  medical_history TEXT,
  examination_findings TEXT,
  diagnosis TEXT,
  diagnosis_icd_code VARCHAR(20),
  treatment_plan TEXT,
  vital_signs JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جداول المواعيد
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES patients(id),
  doctor_id INT NOT NULL REFERENCES users(id),
  service_id INT,
  appointment_date TIMESTAMP NOT NULL,
  duration_minutes INT DEFAULT 15,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  total_cost DECIMAL(10, 2),
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS queue_entries (
  id SERIAL PRIMARY KEY,
  appointment_id INT NOT NULL REFERENCES appointments(id),
  doctor_id INT NOT NULL REFERENCES users(id),
  priority_level INT DEFAULT 1,
  position_in_queue INT,
  estimated_wait_minutes INT,
  status VARCHAR(50) DEFAULT 'waiting',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جداول الأطباء والخدمات
CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id),
  specialization VARCHAR(255),
  license_number VARCHAR(100),
  working_hours JSONB,
  commission_percent DECIMAL(5, 2) DEFAULT 40,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT,
  duration_minutes INT DEFAULT 15,
  base_price DECIMAL(10, 2) NOT NULL,
  tax_percent DECIMAL(5, 2) DEFAULT 15,
  free_follow_up_days INT DEFAULT 7,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctor_services (
  id SERIAL PRIMARY KEY,
  doctor_id INT NOT NULL REFERENCES doctors(id),
  service_id INT NOT NULL REFERENCES services(id),
  custom_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, service_id)
);

-- جداول المختبر
CREATE TABLE IF NOT EXISTS lab_tests (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  category VARCHAR(100),
  sample_type VARCHAR(100),
  base_price DECIMAL(10, 2) NOT NULL,
  turnaround_time_hours INT DEFAULT 24,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_test_parameters (
  id SERIAL PRIMARY KEY,
  test_id INT NOT NULL REFERENCES lab_tests(id),
  parameter_name VARCHAR(255),
  unit VARCHAR(50),
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_test_result_ranges (
  id SERIAL PRIMARY KEY,
  parameter_id INT NOT NULL REFERENCES lab_test_parameters(id),
  gender VARCHAR(20),
  age_min INT,
  age_max INT,
  normal_min DECIMAL(10, 2),
  normal_max DECIMAL(10, 2),
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_orders (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES patients(id),
  doctor_id INT REFERENCES users(id),
  test_id INT NOT NULL REFERENCES lab_tests(id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  sample_collected_at TIMESTAMP,
  results_ready_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_results (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES lab_orders(id),
  parameter_id INT REFERENCES lab_test_parameters(id),
  result_value DECIMAL(10, 2),
  unit VARCHAR(50),
  status VARCHAR(50),
  reviewed_by INT REFERENCES users(id),
  review_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جداول الصيدلية
CREATE TABLE IF NOT EXISTS drugs (
  id SERIAL PRIMARY KEY,
  scientific_name VARCHAR(255) NOT NULL,
  brand_names JSONB,
  category VARCHAR(100),
  form VARCHAR(50),
  strength VARCHAR(50),
  requires_prescription BOOLEAN DEFAULT FALSE,
  is_controlled BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drug_prices (
  id SERIAL PRIMARY KEY,
  drug_id INT NOT NULL REFERENCES drugs(id),
  purchase_price DECIMAL(10, 2),
  selling_price DECIMAL(10, 2),
  insurance_price DECIMAL(10, 2),
  effective_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drug_inventory (
  id SERIAL PRIMARY KEY,
  drug_id INT NOT NULL REFERENCES drugs(id),
  batch_number VARCHAR(100),
  quantity INT DEFAULT 0,
  purchase_date DATE,
  expiry_date DATE,
  supplier VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id SERIAL PRIMARY KEY,
  medical_record_id INT REFERENCES medical_records(id),
  drug_id INT NOT NULL REFERENCES drugs(id),
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  duration_days INT,
  quantity INT,
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جداول المالية
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  patient_id INT NOT NULL REFERENCES patients(id),
  invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date DATE,
  subtotal DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INT NOT NULL REFERENCES invoices(id),
  item_type VARCHAR(50),
  item_id INT,
  description TEXT,
  quantity INT,
  unit_price DECIMAL(10, 2),
  line_total DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  invoice_id INT NOT NULL REFERENCES invoices(id),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10, 2),
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جداول شؤون الموظفين
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id),
  employee_number VARCHAR(50) UNIQUE NOT NULL,
  job_title VARCHAR(255),
  department VARCHAR(255),
  contract_type VARCHAR(50),
  basic_salary DECIMAL(10, 2),
  hire_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employees(id),
  leave_type VARCHAR(50),
  start_date DATE,
  end_date DATE,
  days_requested INT,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء الفهارس
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_file_number ON patients(file_number);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor ON medical_records(doctor_id);
CREATE INDEX idx_medical_records_date ON medical_records(visit_date);
CREATE INDEX idx_queue_doctor ON queue_entries(doctor_id);
CREATE INDEX idx_lab_orders_patient ON lab_orders(patient_id);
CREATE INDEX idx_lab_orders_status ON lab_orders(status);
CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_config_settings_key ON config_settings(key);
CREATE INDEX idx_user_roles ON user_roles(user_id);
CREATE INDEX idx_role_permissions ON role_permissions(role_id);

-- إدراج الأدوار الافتراضية
INSERT INTO roles (name, name_ar, is_system_role) VALUES
  ('SuperAdmin', 'مسؤول النظام', TRUE),
  ('Admin', 'مدير', TRUE),
  ('Doctor', 'طبيب', TRUE),
  ('Nurse', 'ممرض', TRUE),
  ('LabTech', 'فني مختبر', TRUE),
  ('Pharmacist', 'صيدلاني', TRUE),
  ('Accountant', 'محاسب', TRUE),
  ('Patient', 'مريض', TRUE)
ON CONFLICT DO NOTHING;

-- إدراج الصلاحيات الأساسية
INSERT INTO permissions (name, description, module, action) VALUES
  ('appointments.read', 'عرض المواعيد', 'appointments', 'read'),
  ('appointments.write', 'إنشاء وتعديل المواعيد', 'appointments', 'write'),
  ('appointments.delete', 'حذف المواعيد', 'appointments', 'delete'),
  ('medical_records.read', 'عرض السجلات الطبية', 'medical_records', 'read'),
  ('medical_records.write', 'كتابة السجلات الطبية', 'medical_records', 'write'),
  ('pharmacy.read', 'عرض الصيدلية', 'pharmacy', 'read'),
  ('pharmacy.write', 'صرف الأدوية', 'pharmacy', 'write'),
  ('labs.read', 'عرض المختبر', 'labs', 'read'),
  ('labs.write', 'إدخال نتائج المختبر', 'labs', 'write'),
  ('finance.read', 'عرض البيانات المالية', 'finance', 'read'),
  ('finance.write', 'إدارة الفواتير والمدفوعات', 'finance', 'write'),
  ('config.write', 'تعديل الإعدادات', 'config', 'write'),
  ('users.manage', 'إدارة المستخدمين', 'users', 'manage')
ON CONFLICT DO NOTHING;

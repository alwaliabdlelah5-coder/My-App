-- V1__initial_schema.sql

-- Staff/User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'staff', -- 'admin', 'doctor', 'nurse', 'staff'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT,
    blood_group TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id)
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id),
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
    reason_for_visit TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Medical Records
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id),
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    diagnosis TEXT,
    prescription TEXT,
    treatment_plan TEXT,
    attachments JSONB, -- Array of clinical document links
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Staff can manage patients" ON public.patients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can manage appointments" ON public.appointments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can manage records" ON public.medical_records FOR ALL USING (auth.role() = 'authenticated');

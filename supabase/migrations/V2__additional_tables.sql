-- V2__additional_tables.sql

-- Drugs / Inventory
CREATE TABLE IF NOT EXISTS public.drugs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    scientific_name TEXT,
    category TEXT,
    dosage_form TEXT, -- pill, syrup, etc
    strength TEXT,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 10,
    price DECIMAL(10, 2),
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Finance Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category TEXT,
    method TEXT CHECK (method IN ('cash', 'card', 'transfer')) DEFAULT 'cash',
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Laboratory Tests
CREATE TABLE IF NOT EXISTS public.laboratory_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id),
    test_name TEXT NOT NULL,
    result TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    ordered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Clinic Queue
CREATE TABLE IF NOT EXISTS public.clinic_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    arrival_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'waiting', -- 'waiting', 'in_consultation', 'finished'
    priority INTEGER DEFAULT 0
);

-- Pharmacy Prescriptions
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id),
    notes TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'filled', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratory_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Staff can manage drugs" ON public.drugs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can manage transactions" ON public.transactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can manage lab tests" ON public.laboratory_tests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can manage queue" ON public.clinic_queue FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can manage prescriptions" ON public.prescriptions FOR ALL USING (auth.role() = 'authenticated');

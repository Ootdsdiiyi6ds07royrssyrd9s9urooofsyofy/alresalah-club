-- Extension for Students Table
-- Adds profile fields and support for direct registration

-- 1. Add profile fields to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS specialization VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::jsonb;
ALTER TABLE students ADD COLUMN IF NOT EXISTS birth_date DATE;

-- 2. Modify bawaba_id to be nullable to allow direct registration
ALTER TABLE students ALTER COLUMN bawaba_id DROP NOT NULL;

-- 3. Add password_hash for direct authentication if not using Bawaba
ALTER TABLE students ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 4. Create student_auth table for more secure/flexible auth management if needed
-- (Optional, but included as per implementation plan suggestion)
CREATE TABLE IF NOT EXISTS student_auth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for student_auth
ALTER TABLE student_auth ENABLE ROW LEVEL SECURITY;

-- Policies for student_auth
CREATE POLICY "Admins have full access to student_auth"
  ON student_auth FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Add status and approval fields to students
ALTER TABLE students ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE students ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add verification code fields
ALTER TABLE students ADD COLUMN IF NOT EXISTS verification_code TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS code_expiry TIMESTAMP WITH TIME ZONE;

-- Add a comment for documentation
COMMENT ON COLUMN students.status IS 'Status of the student account (pending, active, suspended)';
COMMENT ON COLUMN students.is_approved IS 'Whether the student has been approved by an administrator';

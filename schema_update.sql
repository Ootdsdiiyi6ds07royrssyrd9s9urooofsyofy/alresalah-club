-- Migration Script for Al-Resalah Club Feature Expansion

-- 1. Educational Kits Table
CREATE TABLE IF NOT EXISTS educational_kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_url TEXT,
  file_url TEXT NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for educational_kits
ALTER TABLE educational_kits ENABLE ROW LEVEL SECURITY;

-- Policies for educational_kits
CREATE POLICY "Public can view active kits"
  ON educational_kits FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins have full access to kits"
  ON educational_kits FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Trigger for educational_kits updated_at
CREATE TRIGGER update_kits_updated_at BEFORE UPDATE ON educational_kits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- 2. Update Courses Table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'upcoming'; -- upcoming, active, completed
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_happening_now BOOLEAN DEFAULT false;


-- 3. Students Table (Sync with Bawaba)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bawaba_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(50),
  national_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for students
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Policies for students
CREATE POLICY "Admins have full access to students"
  ON students FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Students can view their own profile"
  ON students FOR SELECT
  USING (bawaba_id::text = current_setting('request.jwt.claim.sub', true));


-- 4. Course Sessions (For Attendance)
CREATE TABLE IF NOT EXISTS course_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  description TEXT, -- Can be used for "Muthakarat" (Notes)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for course_sessions
ALTER TABLE course_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for course_sessions
CREATE POLICY "Admins have full access to sessions"
  ON course_sessions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public/Students can view sessions for active courses"
  ON course_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_sessions.course_id
      AND (courses.is_active = true OR courses.is_happening_now = true)
    )
  );


-- 5. Attendance Records
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES course_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL, -- present, absent, late, excused
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recorded_by UUID, -- Admin ID
  CONSTRAINT unique_attendance_per_session UNIQUE (session_id, student_id)
);

-- Enable RLS for attendance
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policies for attendance
CREATE POLICY "Admins have full access to attendance"
  ON attendance FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Students can view their own attendance"
  ON attendance FOR SELECT
  USING (student_id IN (
      SELECT id FROM students WHERE bawaba_id::text = current_setting('request.jwt.claim.sub', true)
  ));


-- 6. Contact Info (Using existing site_settings, just ensuring key exists in logic)
-- No SQL needed if site_settings is generic JSONB, but let's insert a default if not exists
INSERT INTO site_settings (id, value)
VALUES ('contact_info', '{"email": "info@alresalah.club", "phone": "+966500000000", "address": "Riyadh, Saudi Arabia", "whatsapp": "+966500000000", "twitter": "alresalahclub", "instagram": "alresalahclub"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. Add 'educational_kits' storage bucket policy if needed (assuming 'media' bucket is used)
-- (Handled via Supabase Dashboard usually, but keeping note here)

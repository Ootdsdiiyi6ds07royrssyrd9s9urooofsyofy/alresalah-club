-- Al-Resalah Club Educational Platform - Database Schema
-- Production-ready PostgreSQL schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- COURSES TABLE
-- ============================================================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(255),
  start_date DATE,
  end_date DATE,
  total_seats INTEGER NOT NULL DEFAULT 0,
  available_seats INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT seats_check CHECK (available_seats >= 0 AND available_seats <= total_seats)
);

-- ============================================================================
-- PROGRAMS TABLE
-- ============================================================================
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(100),
  category VARCHAR(100),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- REGISTRATION FORMS TABLE
-- ============================================================================
CREATE TABLE registration_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FORM FIELDS TABLE
-- ============================================================================
CREATE TABLE form_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES registration_forms(id) ON DELETE CASCADE,
  field_name VARCHAR(255) NOT NULL,
  field_label VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- text, email, phone, select, checkbox, radio, textarea, date, number
  is_required BOOLEAN DEFAULT false,
  options JSONB, -- For select, radio, checkbox fields
  validation_rules JSONB, -- Custom validation rules
  placeholder VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- APPLICANTS TABLE
-- ============================================================================
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES registration_forms(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  form_responses JSONB NOT NULL, -- Stores all form field responses
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_email_per_course UNIQUE (course_id, email),
  CONSTRAINT unique_phone_per_course UNIQUE (course_id, phone)
);

-- ============================================================================
-- SURVEYS TABLE
-- ============================================================================
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL, -- NULL for general surveys
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SURVEY QUESTIONS TABLE
-- ============================================================================
CREATE TABLE survey_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- multiple_choice, rating, text, yes_no
  options JSONB, -- For multiple_choice questions
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SURVEY RESPONSES TABLE
-- ============================================================================
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  respondent_email VARCHAR(255),
  responses JSONB NOT NULL, -- Stores all question responses
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_response_per_survey UNIQUE (survey_id, respondent_email)
);

-- ============================================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID, -- Admin user ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- MEDIA GALLERY TABLE
-- ============================================================================
CREATE TABLE media_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_type VARCHAR(50) NOT NULL, -- image, video
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(100), -- events, courses, general
  uploaded_by UUID, -- Admin user ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ACTIVITY LOGS TABLE
-- ============================================================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- Admin user ID
  action_type VARCHAR(100) NOT NULL, -- create, update, delete, login, logout
  entity_type VARCHAR(100), -- course, form, applicant, survey, announcement, media
  entity_id UUID,
  details JSONB, -- Additional action details
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SHAREABLE LINKS TABLE
-- ============================================================================
CREATE TABLE shareable_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(100) NOT NULL, -- course, survey, announcement, form
  entity_id UUID NOT NULL,
  short_code VARCHAR(50) UNIQUE NOT NULL,
  full_url TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_courses_active ON courses(is_active);
CREATE INDEX idx_applicants_course ON applicants(course_id);
CREATE INDEX idx_applicants_email ON applicants(email);
CREATE INDEX idx_form_fields_form ON form_fields(form_id, display_order);
CREATE INDEX idx_survey_questions_survey ON survey_questions(survey_id, display_order);
CREATE INDEX idx_announcements_dates ON announcements(publish_date, expiration_date);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_shareable_links_code ON shareable_links(short_code);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registration_forms_updated_at BEFORE UPDATE ON registration_forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION TO UPDATE AVAILABLE SEATS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_course_seats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses
    SET available_seats = available_seats - 1
    WHERE id = NEW.course_id AND available_seats > 0;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No available seats for this course';
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses
    SET available_seats = available_seats + 1
    WHERE id = OLD.course_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_seats_on_registration
  AFTER INSERT OR DELETE ON applicants
  FOR EACH ROW EXECUTE FUNCTION update_course_seats();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shareable_links ENABLE ROW LEVEL SECURITY;

-- Public read access to active courses
CREATE POLICY "Public can view active courses"
  ON courses FOR SELECT
  USING (is_active = true);

-- Public read access to active programs
CREATE POLICY "Public can view active programs"
  ON programs FOR SELECT
  USING (is_active = true);

-- Public read access to active registration forms
CREATE POLICY "Public can view active forms"
  ON registration_forms FOR SELECT
  USING (is_active = true);

-- Public read access to form fields for active forms
CREATE POLICY "Public can view form fields"
  ON form_fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM registration_forms
      WHERE registration_forms.id = form_fields.form_id
      AND registration_forms.is_active = true
    )
  );

-- Public can insert applicants (registration)
CREATE POLICY "Public can register"
  ON applicants FOR INSERT
  WITH CHECK (true);

-- Public read access to active surveys
CREATE POLICY "Public can view active surveys"
  ON surveys FOR SELECT
  USING (is_active = true);

-- Public read access to survey questions
CREATE POLICY "Public can view survey questions"
  ON survey_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_questions.survey_id
      AND surveys.is_active = true
    )
  );

-- Public can submit survey responses
CREATE POLICY "Public can submit survey responses"
  ON survey_responses FOR INSERT
  WITH CHECK (true);

-- Public read access to active announcements
CREATE POLICY "Public can view active announcements"
  ON announcements FOR SELECT
  USING (
    is_active = true
    AND publish_date <= NOW()
    AND (expiration_date IS NULL OR expiration_date > NOW())
  );

-- Public read access to media gallery
CREATE POLICY "Public can view media"
  ON media_gallery FOR SELECT
  USING (true);

-- Admin full access to all tables (authenticated users only)
CREATE POLICY "Admins have full access to courses"
  ON courses FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to programs"
  ON programs FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to forms"
  ON registration_forms FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to form fields"
  ON form_fields FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can view all applicants"
  ON applicants FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update applicants"
  ON applicants FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to surveys"
  ON surveys FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to survey questions"
  ON survey_questions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can view survey responses"
  ON survey_responses FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to announcements"
  ON announcements FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to media"
  ON media_gallery FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can view activity logs"
  ON activity_logs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can create activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to shareable links"
  ON shareable_links FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Public can view shareable links
CREATE POLICY "Public can view shareable links"
  ON shareable_links FOR SELECT
  USING (expires_at IS NULL OR expires_at > NOW());

-- ============================================================================
-- STORAGE BUCKETS (Run these in Supabase Dashboard or via API)
-- ============================================================================
-- Create storage bucket for media files
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage policies for media bucket
-- CREATE POLICY "Public can view media files"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'media');

-- CREATE POLICY "Admins can upload media files"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- CREATE POLICY "Admins can delete media files"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- نظام الأرشيف المحمي برقم سري
CREATE TABLE IF NOT EXISTS archives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT, -- محتوى الأرشيف (نص أو روابط)
    file_url TEXT, -- رابط ملف إذا وجد
    access_code VARCHAR(6) NOT NULL, -- كود الأرشيف (6 أرقام)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- سياسات الوصول (RLS) لجدول الأرشيف
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;

-- المسؤولون لديهم صلاحية كاملة
CREATE POLICY "Admins have full access to archives"
    ON archives FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- الزوار يمكنهم فقط عرض الأرشيف إذا عرفوا الكود (سيتم التحقق في مستوى الـ API لزيادة الأمان)
CREATE POLICY "Public can view active archives"
    ON archives FOR SELECT
    USING (is_active = true);

-- إضافة فهرس للبحث السريع بالكود
CREATE INDEX idx_archives_code ON archives(access_code);

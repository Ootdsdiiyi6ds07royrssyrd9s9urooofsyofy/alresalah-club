
-- نظام التقارير الديناميكي (المرن)
-- 1. تعريف ميتاداتا التقارير (الهيكل)
CREATE TABLE IF NOT EXISTS report_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, -- اسم التقرير
    description TEXT,
    fields JSONB NOT NULL, -- الحقول المخصصة (الاسم، النوع، الملصق)
    permissions JSONB, -- صلاحيات الوصول (أدوار معينة مثلاً)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. تخزين بيانات التقارير المدخلة
CREATE TABLE IF NOT EXISTS report_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
    data JSONB NOT NULL, -- القيم المدخلة لكل حقل
    created_by UUID, -- المشرف الذي أنشأ الإدخال
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل RLS
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_entries ENABLE ROW LEVEL SECURITY;

-- المسؤولون لديهم صلاحية كاملة
CREATE POLICY "Admins have full access to templates"
    ON report_templates FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to entries"
    ON report_entries FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- إضافة فهارس للسرعة
CREATE INDEX idx_report_entries_template ON report_entries(template_id);

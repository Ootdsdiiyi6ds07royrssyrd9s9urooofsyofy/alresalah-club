'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SmartLearnerSettings() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [learner, setLearner] = useState({
        name: 'عبدالله بن محمد',
        title: 'متعلم متميز',
        cohort: 'دفعة 2025',
        description: 'نكرم في كل عام الطالب الأكثر تميزاً ومشاركة في برامجنا التدريبية. الطالب الذي أثبت جدارته بالتفوق والابتكار.'
    })

    useEffect(() => {
        async function fetchSettings() {
            const { data, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('id', 'smart_learner')
                .single()

            if (data) {
                setLearner(data.value)
            }
            setLoading(false)
        }
        fetchSettings()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('site_settings')
            .upsert({ id: 'smart_learner', value: learner })

        setSaving(false)

        if (error) {
            alert('خطأ في الحفظ: تأكد من أنك قمت بإنشاء جدول site_settings في قاعدة البيانات.\n\n' + error.message)
        } else {
            alert('تم حفظ التغييرات بنجاح')
        }
    }

    if (loading) return <div>جاري التحميل...</div>

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>إدارة المتعلم الذكي</h1>

            <form onSubmit={handleSave} className="card" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                    <label className="label">اسم المتعلم</label>
                    <input
                        className="input"
                        value={learner.name}
                        onChange={e => setLearner({ ...learner, name: e.target.value })}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                        <label className="label">اللقب</label>
                        <input
                            className="input"
                            value={learner.title}
                            onChange={e => setLearner({ ...learner, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">الدفعة / السنة</label>
                        <input
                            className="input"
                            value={learner.cohort}
                            onChange={e => setLearner({ ...learner, cohort: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">الوصف التكريمي</label>
                    <textarea
                        className="input"
                        style={{ minHeight: '100px', padding: '10px' }}
                        value={learner.description}
                        onChange={e => setLearner({ ...learner, description: e.target.value })}
                    />
                </div>

                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </form>

            <div className="card" style={{ marginTop: 'var(--spacing-2xl)', border: '1px solid var(--color-gold)' }}>
                <h3>⚠️ تنبيه تقني</h3>
                <p>للأهمية، تأكد من تشغيل كود SQL الخاص بالجدول الجديد في لوحة تحكم Supabase ليتمكن المشرفون من حفظ هذه البيانات.</p>
            </div>
        </div>
    )
}

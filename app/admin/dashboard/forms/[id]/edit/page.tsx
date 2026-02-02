'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function EditFormPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [courses, setCourses] = useState<any[]>([])
    const [form, setForm] = useState({
        title: '',
        description: '',
        course_id: '',
        is_active: true
    })

    useEffect(() => {
        const fetchData = async () => {
            // Fetch form details
            const { data: formData, error: formError } = await supabase
                .from('registration_forms')
                .select('*')
                .eq('id', params.id)
                .single()

            if (formError) {
                alert('خطأ في تحميل النموذج')
                router.push('/admin/dashboard/forms')
                return
            }

            // Fetch active courses
            const { data: coursesData } = await supabase
                .from('courses')
                .select('id, title')
                .eq('is_active', true)
                .order('created_at', { ascending: false })

            setForm({
                title: formData.title,
                description: formData.description || '',
                course_id: formData.course_id || '',
                is_active: formData.is_active
            })
            setCourses(coursesData || [])
            setLoading(false)
        }
        fetchData()
    }, [params.id, router])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('registration_forms')
            .update({
                title: form.title,
                description: form.description,
                course_id: form.course_id || null, // Handle General forms
                is_active: form.is_active
            })
            .eq('id', params.id)

        setSaving(false)

        if (error) {
            alert('خطأ في التحديث: ' + error.message)
        } else {
            alert('تم التحديث بنجاح')
            router.push('/admin/dashboard/forms')
        }
    }

    if (loading) return <div>جاري التحميل...</div>

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>تعديل نموذج التسجيل</h1>

            <form onSubmit={handleSave} className="card" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                    <label className="label">عنوان النموذج</label>
                    <input
                        className="input"
                        required
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="label">الوصف (اختياري)</label>
                    <textarea
                        className="input"
                        style={{ minHeight: '100px' }}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="label">ربط بدورة (اختياري)</label>
                    <select
                        className="input"
                        value={form.course_id}
                        onChange={e => setForm({ ...form, course_id: e.target.value })}
                    >
                        <option value="">-- نموذج عام (غير مرتبط بدورة) --</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={e => setForm({ ...form, is_active: e.target.checked })}
                            style={{ width: '20px', height: '20px' }}
                        />
                        نموذج نشط (قابل للتسجيل)
                    </label>
                </div>

                <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => router.push('/admin/dashboard/forms')}
                    >
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    )
}

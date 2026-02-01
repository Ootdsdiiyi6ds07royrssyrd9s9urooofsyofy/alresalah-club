'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Course {
    id: string
    title: string
    description: string | null
    available_seats: number
    total_seats: number
}

export default function RegisterPage({ params }: { params: { formId: string } }) {
    const router = useRouter()
    const [form, setForm] = useState<any>(null)
    const [fields, setFields] = useState<any[]>([])
    const [course, setCourse] = useState<Course | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        loadForm()
    }, [params.formId])

    const loadForm = async () => {
        try {
            const supabase = createClient()

            // Fetch form details
            const { data: formData, error: formError } = await supabase
                .from('registration_forms')
                .select('*, courses(*)')
                .eq('id', params.formId)
                .eq('is_active', true)
                .single()

            if (formError || !formData) {
                setError('النموذج غير موجود أو غير نشط')
                return
            }

            setForm(formData)
            if (formData.courses) {
                setCourse(formData.courses as Course)
            }

            // Fetch form fields
            const { data: fieldsData, error: fieldsError } = await supabase
                .from('form_fields')
                .select('*')
                .eq('form_id', params.formId)
                .order('display_order', { ascending: true })

            if (fieldsError) {
                setError('فشل تحميل حقول النموذج')
                return
            }

            setFields(fieldsData || [])
        } catch (err) {
            setError('فشل تحميل النموذج')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            // Validate required fields
            for (const field of fields) {
                if (field.is_required && !formData[field.field_name]) {
                    throw new Error(`${field.field_label} مطلوب`)
                }
            }

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    form_id: params.formId,
                    course_id: form.course_id,
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone,
                    form_responses: formData,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'فشل التسجيل')
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading"></div>
            </div>
        )
    }

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-md)' }}>
                <div className="card" style={{ maxWidth: '500px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>✅</div>
                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>تم التسجيل بنجاح!</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                        شكراً لتسجيلك. ستصلك رسالة تأكيد قريباً.
                    </p>
                    <a href="/" className="btn btn-primary">
                        العودة للرئيسية
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-xl) var(--spacing-md)', backgroundColor: 'var(--color-surface)' }}>
            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="card">
                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>{form?.title || 'نموذج التسجيل'}</h1>
                    {form?.description && (
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                            {form.description}
                        </p>
                    )}

                    {course && (
                        <div className="alert alert-info" style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <strong>الدورة:</strong> {course.title}
                            <br />
                            <strong>المقاعد المتاحة:</strong> {course.available_seats} / {course.total_seats}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Standard fields */}
                        <div className="form-group">
                            <label htmlFor="full_name" className="label">الاسم الكامل *</label>
                            <input
                                id="full_name"
                                type="text"
                                className="input"
                                required
                                value={formData.full_name || ''}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="label">البريد الإلكتروني *</label>
                            <input
                                id="email"
                                type="email"
                                className="input"
                                required
                                value={formData.email || ''}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="label">رقم الجوال *</label>
                            <input
                                id="phone"
                                type="tel"
                                className="input"
                                placeholder="05XXXXXXXX"
                                required
                                value={formData.phone || ''}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        {/* Dynamic fields */}
                        {fields.map((field) => (
                            <div key={field.id} className="form-group">
                                <label htmlFor={field.field_name} className="label">
                                    {field.field_label} {field.is_required && '*'}
                                </label>
                                {field.field_type === 'textarea' ? (
                                    <textarea
                                        id={field.field_name}
                                        className="input"
                                        placeholder={field.placeholder || ''}
                                        required={field.is_required}
                                        value={formData[field.field_name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.field_name]: e.target.value })}
                                        rows={4}
                                    />
                                ) : field.field_type === 'select' ? (
                                    <select
                                        id={field.field_name}
                                        className="input"
                                        required={field.is_required}
                                        value={formData[field.field_name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.field_name]: e.target.value })}
                                    >
                                        <option value="">اختر خياراً</option>
                                        {field.options && Array.isArray(field.options) && field.options.map((option: string) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={field.field_name}
                                        type={field.field_type}
                                        className="input"
                                        placeholder={field.placeholder || ''}
                                        required={field.is_required}
                                        value={formData[field.field_name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.field_name]: e.target.value })}
                                    />
                                )}
                            </div>
                        ))}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting || (course && course.available_seats <= 0)}>
                            {submitting ? (
                                <>
                                    <span className="loading"></span>
                                    جاري الإرسال...
                                </>
                            ) : course && course.available_seats <= 0 ? (
                                'لا توجد مقاعد متاحة'
                            ) : (
                                'إرسال التسجيل'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

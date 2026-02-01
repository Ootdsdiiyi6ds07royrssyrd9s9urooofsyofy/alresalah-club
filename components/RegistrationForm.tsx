'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RegistrationFormProps {
    formId: string
    courseId?: string
    courseTitle?: string
    availableSeats?: number
    totalSeats?: number
    onSuccess?: () => void
}

export default function RegistrationForm({ formId, courseId, courseTitle, availableSeats, totalSeats, onSuccess }: RegistrationFormProps) {
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [fields, setFields] = useState<any[]>([])
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [formDetails, setFormDetails] = useState<any>(null)

    useEffect(() => {
        loadFormFields()
    }, [formId])

    const loadFormFields = async () => {
        try {
            const supabase = createClient()

            // Fetch form details if not passed enough info (optional, but good for validation)
            const { data: fData, error: fError } = await supabase
                .from('registration_forms')
                .select('*')
                .eq('id', formId)
                .single()

            if (fData) setFormDetails(fData)

            const { data: fieldsData, error: fieldsError } = await supabase
                .from('form_fields')
                .select('*')
                .eq('form_id', formId)
                .order('display_order', { ascending: true })

            if (fieldsError) throw fieldsError
            setFields(fieldsData || [])
        } catch (err) {
            console.error(err)
            setError('فشل تحميل أسئلة النموذج')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            // Validate
            for (const field of fields) {
                if (field.is_required && !formData[field.field_name]) {
                    throw new Error(`${field.field_label} مطلوب`)
                }
            }

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    form_id: formId,
                    course_id: courseId, // Use prop if available
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
            if (onSuccess) onSuccess()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="loading" style={{ margin: '2rem auto' }}></div>

    if (success) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)', border: '2px solid var(--color-success)', background: 'rgba(16, 185, 129, 0.05)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>✅</div>
                <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-success)' }}>تم التسجيل بنجاح!</h3>
                <p>تم استلام طلبك للتسجيل في {courseTitle}.</p>
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm">تسجيل آخر</button>
                </div>
            </div>
        )
    }

    return (
        <div className="registration-form-container">
            {error && <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
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
                </div>

                {fields.length > 0 && <hr style={{ margin: 'var(--spacing-lg) 0', borderColor: 'var(--color-border)' }} />}

                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {fields.filter(field => !['الاسم الكامل', 'البريد الإلكتروني', 'رقم الجوال'].includes(field.field_label)).map((field) => (
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
                                    rows={3}
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
                                    {field.options && Array.isArray(JSON.parse(field.options as string)) && JSON.parse(field.options as string).map((option: string) => (
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
                </div>

                <div style={{ marginTop: 'var(--spacing-xl)' }}>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        disabled={submitting || (availableSeats !== undefined && availableSeats <= 0)}
                    >
                        {submitting ? 'جاري الإرسال...' : (availableSeats !== undefined && availableSeats <= 0) ? 'التسجيل مغلق (ممتلئ)' : 'إرسال طلب التسجيل'}
                    </button>
                    {(availableSeats !== undefined && availableSeats <= 0) && (
                        <p style={{ textAlign: 'center', color: 'var(--color-error)', marginTop: 'var(--spacing-sm)' }}>عذراً، لا توجد مقاعد شاغرة حالياً.</p>
                    )}
                </div>
            </form>
        </div>
    )
}

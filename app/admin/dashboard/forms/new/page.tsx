'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface FormField {
    label: string
    type: 'text' | 'email' | 'phone' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio'
    required: boolean
    options?: string[]
    placeholder?: string
}

export default function NewRegistrationFormPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState<any[]>([])

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course_id: '',
        is_active: true
    })

    const [fields, setFields] = useState<FormField[]>([
        { label: 'الاسم الكامل', type: 'text', required: true },
        { label: 'البريد الإلكتروني', type: 'email', required: true },
        { label: 'رقم الجوال', type: 'phone', required: true }
    ])

    useEffect(() => {
        async function fetchCourses() {
            const { data } = await supabase.from('courses').select('id, title').eq('is_active', true)
            if (data) setCourses(data)
        }
        fetchCourses()
    }, [])

    const addField = () => {
        setFields([...fields, { label: '', type: 'text', required: false }])
    }

    const removeField = (index: number) => {
        if (index < 3) {
            alert('لا يمكن حذف الحقول الأساسية الثلاثة الأولى')
            return
        }
        const newFields = [...fields]
        newFields.splice(index, 1)
        setFields(newFields)
    }

    const updateField = (index: number, updates: Partial<FormField>) => {
        const newFields = [...fields]
        newFields[index] = { ...newFields[index], ...updates }
        setFields(newFields)
    }

    const addOption = (fIndex: number) => {
        const f = fields[fIndex]
        const options = f.options ? [...f.options, ''] : ['']
        updateField(fIndex, { options })
    }

    const updateOption = (fIndex: number, oIndex: number, value: string) => {
        const options = [...(fields[fIndex].options || [])]
        options[oIndex] = value
        updateField(fIndex, { options })
    }

    const removeOption = (fIndex: number, oIndex: number) => {
        const options = [...(fields[fIndex].options || [])]
        options.splice(oIndex, 1)
        updateField(fIndex, { options })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // 1. Insert Form
        const { data: form, error: formError } = await (supabase
            .from('registration_forms')
            .insert([{
                title: formData.title,
                description: formData.description,
                course_id: formData.course_id || null,
                is_active: formData.is_active
            }])
            .select()
            .single() as any)

        if (formError) {
            alert('حدث خطأ أثناء حفظ النموذج: ' + formError.message)
            setLoading(false)
            return
        }

        // 2. Insert Fields
        const fieldsToInsert = fields.map((f, index) => ({
            form_id: form.id,
            field_label: f.label,
            field_name: `field_${index}`,
            field_type: f.type,
            is_required: f.required,
            placeholder: f.placeholder || '',
            display_order: index,
            options: f.options ? JSON.stringify(f.options) : null
        }))

        const { error: fieldsError } = await (supabase
            .from('form_fields')
            .insert(fieldsToInsert) as any)

        setLoading(false)

        if (fieldsError) {
            alert('تم إنشاء النموذج ولكن حدث خطأ في إضافة الحقول: ' + fieldsError.message)
        } else {
            router.push('/admin/dashboard/forms')
            router.refresh()
        }
    }

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>إنشاء نموذج تسجيل جديد</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>صمم نموذج القبول الخاص بك وحدد البيانات المطلوبة من المتقدمين</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                {/* Form Basic Info */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>المعلومات الأساسية</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label className="label">عنوان النموذج</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="مثال: نموذج التسجيل في دورة الربوت"
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="label">ارتباط بدورة (اختياري)</label>
                                <select
                                    className="input"
                                    value={formData.course_id}
                                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                >
                                    <option value="">نموذج عام (غير مرتبط بدورة)</option>
                                    {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="label">الحالة</label>
                                <select
                                    className="input"
                                    value={formData.is_active ? 'active' : 'inactive'}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                                >
                                    <option value="active">نشط (يظهر للعامة)</option>
                                    <option value="inactive">مسودة (للمشرفين فقط)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fields Builder */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h3 style={{ margin: 0 }}>حقول النموذج</h3>
                        <button type="button" onClick={addField} className="btn btn-secondary btn-sm">
                            + إضافة حقل مخصص
                        </button>
                    </div>

                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {fields.map((f, index) => (
                            <div key={index} className="card" style={{ borderRight: index < 3 ? '4px solid var(--color-accent)' : '4px solid var(--color-primary)', position: 'relative' }}>
                                {index >= 3 && (
                                    <button
                                        type="button"
                                        onClick={() => removeField(index)}
                                        style={{ position: 'absolute', top: '10px', left: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                                    >
                                        ❌
                                    </button>
                                )}

                                {index < 3 && <span style={{ fontSize: '0.75rem', position: 'absolute', top: '10px', left: '10px', color: 'var(--color-accent)' }}>حقل أساسي 🔒</span>}

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                                    <div className="form-group">
                                        <label className="label">تسمية الحقل (Label)</label>
                                        <input
                                            type="text"
                                            required
                                            className="input"
                                            value={f.label}
                                            onChange={(e) => updateField(index, { label: e.target.value })}
                                            placeholder="مثال: التخصص الدراسي"
                                            disabled={index < 3}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">نوع الحقل</label>
                                        <select
                                            className="input"
                                            value={f.type}
                                            onChange={(e) => {
                                                const newType = e.target.value as any
                                                const needsOptions = ['select', 'radio', 'checkbox'].includes(newType)
                                                updateField(index, {
                                                    type: newType,
                                                    options: needsOptions ? (f.options || ['']) : undefined
                                                })
                                            }}
                                            disabled={index < 3}
                                        >
                                            <option value="text">نص قصير</option>
                                            <option value="email">بريد إلكتروني</option>
                                            <option value="phone">رقم جوال</option>
                                            <option value="number">رقم</option>
                                            <option value="date">تاريخ</option>
                                            <option value="textarea">نص طويل</option>
                                            <option value="select">قائمة خيارات</option>
                                            <option value="radio">اختيار واحد</option>
                                            <option value="checkbox">اختيارات متعددة</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '25px', gap: 'var(--spacing-xs)' }}>
                                        <input
                                            type="checkbox"
                                            id={`req-f-${index}`}
                                            checked={f.required}
                                            onChange={(e) => updateField(index, { required: e.target.checked })}
                                            disabled={index < 3}
                                        />
                                        <label htmlFor={`req-f-${index}`} style={{ fontSize: 'var(--font-size-sm)' }}>مطلوب</label>
                                    </div>
                                </div>

                                {['select', 'radio', 'checkbox'].includes(f.type) && (
                                    <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                                        <label className="label" style={{ marginBottom: 'var(--spacing-xs)' }}>إدارة الخيارات:</label>
                                        <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
                                            {f.options?.map((opt, oIndex) => (
                                                <div key={oIndex} style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="input"
                                                        style={{ height: '35px' }}
                                                        value={opt}
                                                        onChange={(e) => updateOption(index, oIndex, e.target.value)}
                                                        placeholder={`خيار رقم ${oIndex + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(index, oIndex)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                        disabled={f.options!.length <= 1}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addOption(index)}
                                                className="btn btn-sm"
                                                style={{ border: '1px dashed var(--color-primary)', color: 'var(--color-primary)', marginTop: 'var(--spacing-xs)' }}
                                            >
                                                + إضافة خيار جديد
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', padding: 'var(--spacing-xl)', position: 'sticky', bottom: 0, backgroundColor: 'var(--color-background)', borderTop: '1px solid var(--color-border)' }}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 2 }}>
                        {loading ? 'جاري الحفظ...' : 'حفظ النموذج'}
                    </button>
                    <button type="button" onClick={() => router.back()} className="btn btn-secondary" style={{ flex: 1 }}>
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    )
}

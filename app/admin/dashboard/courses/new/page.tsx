'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react'

type FieldType = 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'number'

interface FormField {
    label: string
    type: FieldType
    required: boolean
    options?: string[]
}

export default function NewCoursePage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        start_date: '',
        end_date: '',
        total_seats: 30,
        price: 0,
        is_active: true
    })

    // Form Builder State
    const [fields, setFields] = useState<FormField[]>([
        { label: 'الاسم الكامل', type: 'text', required: true },
        { label: 'البريد الإلكتروني', type: 'email', required: true },
        { label: 'رقم الجوال', type: 'phone', required: true }
    ])

    const addField = () => {
        setFields([...fields, { label: 'سؤال جديد', type: 'text', required: true }])
    }

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index))
    }

    const updateField = (index: number, key: keyof FormField, value: any) => {
        const newFields = [...fields]
        newFields[index] = { ...newFields[index], [key]: value }
        setFields(newFields)
    }

    const handleOptionChange = (index: number, optionsStr: string) => {
        const options = optionsStr.split(',').map(s => s.trim()).filter(s => s)
        updateField(index, 'options', options)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // 1. Create Course
        const { data: course, error: courseError } = await (supabase
            .from('courses')
            .insert([{
                ...formData,
                available_seats: formData.total_seats
            }])
            .select()
            .single() as any)

        if (courseError) {
            alert('حدث خطأ أثناء إضافة الدورة: ' + courseError.message)
            setLoading(false)
            return
        }

        // 2. Create Registration Form Linked to Course
        const { data: form, error: formError } = await (supabase
            .from('registration_forms')
            .insert([{
                title: `تسجيل في: ${course.title}`,
                description: `نموذج التسجيل الرسمي لدورة ${course.title}`,
                course_id: course.id,
                is_active: true
            }])
            .select()
            .single() as any)

        if (formError) {
            console.error('Error creating form:', formError)
            alert('تم إنشاء الدورة ولكن فشل إنشاء نموذج التسجيل.')
            // Optional: Delete course if form creation fails
        } else {
            // 3. Add Fields to Form
            const fieldsToInsert = fields.map((f, index) => ({
                form_id: form.id,
                field_label: f.label,
                field_name: `field_${index}`,
                field_type: f.type,
                is_required: f.required,
                display_order: index,
                options: f.options ? JSON.stringify(f.options) : null
            }))

            const { error: fieldsError } = await (supabase
                .from('form_fields')
                .insert(fieldsToInsert) as any)

            if (fieldsError) {
                console.error('Error adding fields:', fieldsError)
                alert('تم إنشاء الدورة والنموذج ولكن فشل حفظ الأسئلة.')
            }
        }

        setLoading(false)
        router.push('/admin/dashboard/courses')
        router.refresh()
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <button onClick={() => router.back()} className="btn btn-ghost" style={{ padding: '8px' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>إضافة دورة جديدة</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>أدخل معلومات الدورة وأسئلة التسجيل المطلوبة</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
                {/* Course Details Section */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-sm)' }}>
                        بيانات الدورة
                    </h2>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label className="label">عنوان الدورة</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="مثال: دورة الذكاء الاصطناعي"
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">الوصف</label>
                            <textarea
                                className="input"
                                style={{ minHeight: '100px', padding: '10px' }}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="وصف تفصيلي للدورة..."
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="label">المحاضر</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.instructor}
                                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">السعر (ريال)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="label">تاريخ البدء</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">تاريخ الانتهاء</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">عدد المقاعد</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.total_seats}
                                    onChange={(e) => setFormData({ ...formData, total_seats: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Builder Section */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-sm)' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                            أسئلة نموذج التسجيل
                        </h2>
                        <button type="button" onClick={addField} className="btn btn-secondary btn-sm" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Plus size={16} />
                            إضافة سؤال
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {fields.map((field, index) => (
                            <div key={index} style={{
                                padding: 'var(--spacing-md)',
                                backgroundColor: 'var(--color-background)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 'var(--spacing-md)', alignItems: 'end' }}>
                                    <div className="form-group">
                                        <label className="label" style={{ fontSize: '0.8rem' }}>نص السؤال</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={field.label}
                                            onChange={(e) => updateField(index, 'label', e.target.value)}
                                            placeholder="سؤال جديد"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="label" style={{ fontSize: '0.8rem' }}>نوع الإجابة</label>
                                        <select
                                            className="input"
                                            value={field.type}
                                            onChange={(e) => updateField(index, 'type', e.target.value)}
                                        >
                                            <option value="text">نص قصير</option>
                                            <option value="textarea">نص طويل</option>
                                            <option value="email">بريد إلكتروني</option>
                                            <option value="phone">رقم جوال</option>
                                            <option value="number">رقم</option>
                                            <option value="date">تاريخ</option>
                                            <option value="select">قائمة منسدلة</option>
                                            <option value="radio">خيارات (واحدة فقط)</option>
                                            <option value="checkbox">خيارات (متعددة)</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeField(index)}
                                        style={{
                                            color: 'var(--color-error)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '8px'
                                        }}
                                        title="حذف السؤال"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                                        <label className="label" style={{ fontSize: '0.8rem' }}>الخيارات (افصل بينها بفاصلة)</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="خيار 1, خيار 2, خيار 3"
                                            value={field.options ? field.options.join(', ') : ''}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                        />
                                    </div>
                                )}

                                <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={(e) => updateField(index, 'required', e.target.checked)}
                                        />
                                        هذا السؤال مطلوب
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                        إلغاء
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '150px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Save size={20} />
                        {loading ? 'جاري الحفظ...' : 'حفظ الدورة'}
                    </button>
                </div>
            </form>
        </div>
    )
}

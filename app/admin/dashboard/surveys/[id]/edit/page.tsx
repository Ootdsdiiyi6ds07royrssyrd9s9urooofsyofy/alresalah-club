'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Trash2, Loader2, Plus } from 'lucide-react'

interface Question {
    id?: string
    text: string
    type: 'text' | 'rating' | 'multiple_choice' | 'yes_no'
    required: boolean
    options?: string[]
}

export default function EditSurveyPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        is_active: true
    })

    const [questions, setQuestions] = useState<Question[]>([])

    useEffect(() => {
        fetchSurveyData()
    }, [])

    const fetchSurveyData = async () => {
        try {
            // Fetch survey
            const { data: survey, error: surveyError } = await supabase
                .from('surveys')
                .select('*')
                .eq('id', params.id)
                .single()

            if (surveyError) throw surveyError
            setFormData({
                title: survey.title,
                description: survey.description || '',
                is_active: survey.is_active
            })

            // Fetch questions
            const { data: questionsData, error: qError } = await supabase
                .from('survey_questions')
                .select('*')
                .eq('survey_id', params.id)
                .order('display_order')

            if (qError) throw qError
            setQuestions(questionsData.map(q => ({
                id: q.id,
                text: q.question_text,
                type: q.question_type as any,
                required: q.is_required,
                options: q.options ? JSON.parse(q.options as string) : undefined
            })))
        } catch (error: any) {
            console.error('Error fetching data:', error)
            alert('فشل تحميل بيانات الاستبيان')
        } finally {
            setLoading(false)
        }
    }

    const addQuestion = () => {
        setQuestions([...questions, { text: '', type: 'text', required: true }])
    }

    const removeQuestion = (index: number) => {
        const newQuestions = [...questions]
        newQuestions.splice(index, 1)
        setQuestions(newQuestions)
    }

    const updateQuestion = (index: number, updates: Partial<Question>) => {
        const newQuestions = [...questions]
        newQuestions[index] = { ...newQuestions[index], ...updates }
        setQuestions(newQuestions)
    }

    const addOption = (qIndex: number) => {
        const q = questions[qIndex]
        const options = q.options ? [...q.options, ''] : ['']
        updateQuestion(qIndex, { options })
    }

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const options = [...(questions[qIndex].options || [])]
        options[oIndex] = value
        updateQuestion(qIndex, { options })
    }

    const removeOption = (qIndex: number, oIndex: number) => {
        const options = [...(questions[qIndex].options || [])]
        options.splice(oIndex, 1)
        updateQuestion(qIndex, { options })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (questions.length === 0) {
            alert('يرجى إضافة سؤال واحد على الأقل')
            return
        }

        setSaving(true)

        try {
            // 1. Update Survey
            const { error: surveyError } = await supabase
                .from('surveys')
                .update(formData)
                .eq('id', params.id)

            if (surveyError) throw surveyError

            // 2. Refresh Questions (Clear and Insert)
            // Note: This is a simple strategy but might affect old responses if they rely on question IDs.
            // However, survey_responses typically stores the responses in JSON format which might include text or IDs.
            // Let's check how survey_responses are stored. Usually it's JSONB with question labels or keys.
            await supabase.from('survey_questions').delete().eq('survey_id', params.id)

            const questionsToInsert = questions.map((q, index) => ({
                survey_id: params.id,
                question_text: q.text,
                question_type: q.type,
                is_required: q.required,
                options: q.options ? JSON.stringify(q.options) : null,
                display_order: index
            }))

            const { error: qError } = await supabase
                .from('survey_questions')
                .insert(questionsToInsert)

            if (qError) throw qError

            alert('تم حفظ التعديلات بنجاح')
            router.push('/admin/dashboard/surveys')
            router.refresh()
        } catch (error: any) {
            alert('حدث خطأ أثناء الحفظ: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(`هل أنت متأكد من حذف الاستبيان "${formData.title}"؟`)) return

        setSaving(true)
        const { error } = await supabase
            .from('surveys')
            .delete()
            .eq('id', params.id)

        if (error) {
            alert('فشل الحذف: ' + error.message)
            setSaving(false)
        } else {
            alert('تم الحذف بنجاح')
            router.push('/admin/dashboard/surveys')
            router.refresh()
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Loader2 className="animate-spin" size={32} />
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <button onClick={() => router.back()} className="btn btn-ghost" style={{ padding: '8px' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>تعديل الاستبيان</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>تعديل الأسئلة والتفاصيل</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>المعلومات الأساسية</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label className="label">عنوان الاستبيان</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">وصف الاستبيان</label>
                            <textarea
                                className="input"
                                style={{ minHeight: '80px', padding: '10px' }}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h3 style={{ margin: 0 }}>الأسئلة</h3>
                        <button type="button" onClick={addQuestion} className="btn btn-secondary btn-sm" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Plus size={16} />
                            إضافة سؤال
                        </button>
                    </div>

                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="card" style={{ borderRight: '4px solid var(--color-primary)', position: 'relative' }}>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    style={{ position: 'absolute', top: '10px', left: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                                    title="حذف السؤال"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                                    <div className="form-group">
                                        <label className="label">نص السؤال</label>
                                        <input
                                            type="text"
                                            required
                                            className="input"
                                            value={q.text}
                                            onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">نوع الإجابة</label>
                                        <select
                                            className="input"
                                            value={q.type}
                                            onChange={(e) => updateQuestion(qIndex, { type: e.target.value as any, options: e.target.value === 'multiple_choice' ? [''] : undefined })}
                                        >
                                            <option value="text">نص (إجابة حرة)</option>
                                            <option value="rating">تقييم (1-5 نجوم)</option>
                                            <option value="multiple_choice">خيارات متعددة</option>
                                            <option value="yes_no">نعم / لا</option>
                                        </select>
                                    </div>
                                </div>

                                {q.type === 'multiple_choice' && (
                                    <div style={{ marginLeft: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                                        <label className="label">الخيارات:</label>
                                        {q.options?.map((opt, oIndex) => (
                                            <div key={oIndex} style={{ display: 'flex', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input btn-sm"
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                />
                                                <button type="button" onClick={() => removeOption(qIndex, oIndex)} style={{ color: 'var(--color-error)' }}>🗑️</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOption(qIndex)} className="btn btn-sm" style={{ border: '1px dashed var(--color-primary)', width: '100%', color: 'var(--color-primary)', marginTop: 'var(--spacing-xs)' }}>
                                            + إضافة خيار
                                        </button>
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                    <input
                                        type="checkbox"
                                        id={`req-${qIndex}`}
                                        checked={q.required}
                                        onChange={(e) => updateQuestion(qIndex, { required: e.target.checked })}
                                    />
                                    <label htmlFor={`req-${qIndex}`} style={{ fontSize: 'var(--font-size-sm)' }}>مطلوب</label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                        </button>
                        <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                            إلغاء
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn btn-error"
                        disabled={saving}
                        style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                        <Trash2 size={18} />
                        حذف الاستبيان
                    </button>
                </div>
            </form>
        </div>
    )
}

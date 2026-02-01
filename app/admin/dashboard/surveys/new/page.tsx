'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Question {
    text: string
    type: 'text' | 'rating' | 'multiple_choice' | 'yes_no'
    required: boolean
    options?: string[]
}

export default function NewSurveyPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        is_active: true
    })

    const [questions, setQuestions] = useState<Question[]>([
        { text: '', type: 'text', required: true }
    ])

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

        setLoading(true)

        // 1. Insert Survey
        const { data: survey, error: surveyError } = await (supabase
            .from('surveys')
            .insert([formData])
            .select()
            .single() as any)

        if (surveyError) {
            alert('حدث خطأ أثناء إضافة الاستبيان: ' + surveyError.message)
            setLoading(false)
            return
        }

        // 2. Insert Questions
        const questionsToInsert = questions.map((q, index) => ({
            survey_id: survey.id,
            question_text: q.text,
            question_type: q.type,
            is_required: q.required,
            options: q.options ? JSON.stringify(q.options) : null,
            display_order: index
        }))

        const { error: questionsError } = await (supabase
            .from('survey_questions')
            .insert(questionsToInsert) as any)

        setLoading(false)

        if (questionsError) {
            alert('تم إنشاء الاستبيان ولكن حدث خطأ في إضافة الأسئلة: ' + questionsError.message)
        } else {
            router.push('/admin/dashboard/surveys')
            router.refresh()
        }
    }

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>إنشاء استبيان جديد</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>صمم أسئلتك واجمع آراء المتعلمين بسهولة</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                {/* Survey Basic Info */}
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
                                placeholder="مثال: تقييم دورة الذكاء الاصطناعي"
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">وصف الاستبيان</label>
                            <textarea
                                className="input"
                                style={{ minHeight: '80px', padding: '10px' }}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="اكتب هنا توضيحاً للمشاركين حول هدف الاستبيان..."
                            />
                        </div>
                    </div>
                </div>

                {/* Questions Builder */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h3 style={{ margin: 0 }}>الأسئلة</h3>
                        <button type="button" onClick={addQuestion} className="btn btn-secondary btn-sm">
                            + إضافة سؤال جديد
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
                                    ❌
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
                                            placeholder="اكتب سؤالك هنا..."
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
                                    <div style={{ marginLeft: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                                        <label className="label">الخيارات:</label>
                                        {q.options?.map((opt, oIndex) => (
                                            <div key={oIndex} style={{ display: 'flex', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input btn-sm"
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                    placeholder={`خيار ${oIndex + 1}`}
                                                />
                                                <button type="button" onClick={() => removeOption(qIndex, oIndex)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOption(qIndex)} className="btn btn-sm" style={{ border: '1px dashed var(--color-primary)', width: '100%', color: 'var(--color-primary)' }}>
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

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', padding: 'var(--spacing-xl)', position: 'sticky', bottom: 0, backgroundColor: 'var(--color-background)', borderTop: '1px solid var(--color-border)' }}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 2 }}>
                        {loading ? 'جاري الحفظ...' : 'حفظ ونشر الاستبيان'}
                    </button>
                    <button type="button" onClick={() => router.back()} className="btn btn-secondary" style={{ flex: 1 }}>
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    )
}

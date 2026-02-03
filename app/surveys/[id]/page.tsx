'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SurveyPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [survey, setSurvey] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [responses, setResponses] = useState<Record<string, any>>({})
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        loadSurvey()
    }, [params.id])

    const loadSurvey = async () => {
        try {
            // Fetch survey details
            const { data: surveyData, error: surveyError } = await supabase
                .from('surveys')
                .select('*')
                .eq('id', params.id)
                .eq('is_active', true)
                .single()

            if (surveyError) throw surveyError
            setSurvey(surveyData)

            // Fetch questions
            const { data: questionsData, error: questionsError } = await supabase
                .from('survey_questions')
                .select('*')
                .eq('survey_id', params.id)
                .order('display_order', { ascending: true })

            if (questionsError) throw questionsError
            setQuestions(questionsData || [])
        } catch (err: any) {
            console.error(err)
            setError('فشل تحميل الاستبيان')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            // Validate required questions
            for (const question of questions) {
                if (question.is_required && !responses[question.id]) {
                    throw new Error(`${question.question_text} - هذا السؤال مطلوب`)
                }
            }

            // Submit response
            const { error: submitError } = await supabase
                .from('survey_responses')
                .insert({
                    survey_id: params.id,
                    respondent_email: email || null,
                    responses: responses
                })

            if (submitError) throw submitError

            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
                <div className="loading" style={{ margin: '2rem auto' }}></div>
            </div>
        )
    }

    if (!survey) {
        return (
            <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
                <h1>الاستبيان غير موجود</h1>
                <Link href="/surveys" className="btn btn-secondary" style={{ marginTop: 'var(--spacing-lg)' }}>
                    العودة للاستبيانات
                </Link>
            </div>
        )
    }

    if (success) {
        return (
            <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px solid var(--color-success)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>✅</div>
                    <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-success)' }}>
                        شكراً لمشاركتك!
                    </h2>
                    <p style={{ marginBottom: 'var(--spacing-lg)' }}>تم إرسال إجاباتك بنجاح</p>
                    <Link href="/surveys" className="btn btn-primary">
                        العودة للاستبيانات
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/surveys" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
                ← العودة للاستبيانات
            </Link>

            <div className="card">
                <h1 style={{ marginBottom: 'var(--spacing-md)' }}>{survey.title}</h1>
                {survey.description && (
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                        {survey.description}
                    </p>
                )}

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    <div className="form-group">
                        <label className="label">البريد الإلكتروني (اختياري)</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                        />
                    </div>

                    <hr style={{ borderColor: 'var(--color-border)' }} />

                    {questions.map((question) => (
                        <div key={question.id} className="form-group">
                            <label className="label">
                                {question.question_text} {question.is_required && '*'}
                            </label>

                            {(question.question_type === 'text' || question.question_type === 'email' || question.question_type === 'phone' || question.question_type === 'number' || question.question_type === 'date') && (
                                <input
                                    type={question.question_type === 'phone' ? 'tel' : question.question_type}
                                    className="input"
                                    required={question.is_required}
                                    value={responses[question.id] || ''}
                                    onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
                                />
                            )}

                            {question.question_type === 'textarea' && (
                                <textarea
                                    className="input"
                                    required={question.is_required}
                                    value={responses[question.id] || ''}
                                    onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
                                    rows={3}
                                />
                            )}

                            {question.question_type === 'rating' && (
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => setResponses({ ...responses, [question.id]: rating })}
                                            style={{
                                                padding: 'var(--spacing-md)',
                                                border: `2px solid ${responses[question.id] === rating ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                borderRadius: 'var(--radius-md)',
                                                background: responses[question.id] === rating ? 'var(--color-primary)' : 'transparent',
                                                color: responses[question.id] === rating ? 'white' : 'var(--color-text)',
                                                cursor: 'pointer',
                                                fontWeight: 500
                                            }}
                                        >
                                            {rating}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {question.question_type === 'yes_no' && (
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <button
                                        type="button"
                                        onClick={() => setResponses({ ...responses, [question.id]: 'نعم' })}
                                        className={`btn ${responses[question.id] === 'نعم' ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        نعم
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setResponses({ ...responses, [question.id]: 'لا' })}
                                        className={`btn ${responses[question.id] === 'لا' ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        لا
                                    </button>
                                </div>
                            )}

                            {question.question_type === 'select' && question.options && (
                                <select
                                    className="input"
                                    required={question.is_required}
                                    value={responses[question.id] || ''}
                                    onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
                                >
                                    <option value="">اختر...</option>
                                    {JSON.parse(question.options as string).map((option: string) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}

                            {question.question_type === 'radio' && question.options && (
                                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                                    {JSON.parse(question.options as string).map((option: string) => (
                                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name={question.id}
                                                required={question.is_required}
                                                checked={responses[question.id] === option}
                                                onChange={() => setResponses({ ...responses, [question.id]: option })}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {question.question_type === 'checkbox' && question.options && (
                                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                                    {JSON.parse(question.options as string).map((option: string) => (
                                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={(responses[question.id] || []).includes(option)}
                                                onChange={(e) => {
                                                    const current = responses[question.id] || []
                                                    if (e.target.checked) {
                                                        setResponses({ ...responses, [question.id]: [...current, option] })
                                                    } else {
                                                        setResponses({ ...responses, [question.id]: current.filter((o: string) => o !== option) })
                                                    }
                                                }}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ width: '100%' }}>
                        {submitting ? 'جاري الإرسال...' : 'إرسال الإجابات'}
                    </button>
                </form>
            </div>
        </div>
    )
}

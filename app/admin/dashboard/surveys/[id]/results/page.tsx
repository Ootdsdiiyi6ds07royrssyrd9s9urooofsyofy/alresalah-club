export const dynamic = 'force-dynamic'

'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function SurveyResultsPage() {
    const params = useParams()
    const surveyId = params.id as string
    const supabase = createClient()

    const [survey, setSurvey] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [responses, setResponses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSurveyData()
    }, [surveyId])

    const loadSurveyData = async () => {
        // Load survey info
        const { data: surveyData } = await supabase
            .from('surveys')
            .select('*')
            .eq('id', surveyId)
            .single()
        setSurvey(surveyData)

        // Load questions
        const { data: questionsData } = await supabase
            .from('survey_questions')
            .select('*')
            .eq('survey_id', surveyId)
            .order('display_order')
        setQuestions(questionsData || [])

        // Load responses
        const { data: responsesData } = await supabase
            .from('survey_responses')
            .select('*')
            .eq('survey_id', surveyId)
            .order('submitted_at', { ascending: false })
        setResponses(responsesData || [])

        setLoading(false)
    }

    const getQuestionStats = (questionId: string, questionType: string) => {
        const answers = responses.map(r => r.responses[questionId]).filter(Boolean)

        if (questionType === 'rating') {
            const avg = answers.length > 0
                ? (answers.reduce((sum: number, val: number) => sum + val, 0) / answers.length).toFixed(1)
                : '0'
            return `متوسط التقييم: ${avg}/5`
        } else if (questionType === 'yes_no') {
            const yes = answers.filter((a: string) => a === 'نعم').length
            const no = answers.filter((a: string) => a === 'لا').length
            return `نعم: ${yes} | لا: ${no}`
        } else if (questionType === 'multiple_choice') {
            const counts: any = {}
            answers.forEach((a: string) => {
                counts[a] = (counts[a] || 0) + 1
            })
            return Object.entries(counts)
                .map(([option, count]) => `${option}: ${count}`)
                .join(' | ')
        }
        return `${answers.length} إجابة`
    }

    if (loading) return <div className="loading" style={{ margin: '2rem auto' }}></div>
    if (!survey) return <div style={{ textAlign: 'center', padding: '2rem' }}>الاستبيان غير موجود</div>

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <a href="/admin/dashboard/surveys" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)', display: 'inline-block' }}>
                    ← العودة للاستبيانات
                </a>
                <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>نتائج الاستبيان</h1>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', fontWeight: 'normal' }}>
                    {survey.title}
                </h2>
            </div>

            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
                    <div>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>عدد الردود</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{responses.length}</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>عدد الأسئلة</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{questions.length}</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>الحالة</p>
                        <span className={`badge badge-${survey.is_active ? 'success' : 'muted'}`}>
                            {survey.is_active ? 'نشط' : 'منتهي'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>ملخص الإجابات</h3>
                {questions.map((question) => (
                    <div key={question.id} className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1rem' }}>{question.question_text}</h4>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            {getQuestionStats(question.id, question.question_type)}
                        </p>
                    </div>
                ))}
            </div>

            <div>
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>الردود التفصيلية ({responses.length})</h3>
                <div className="card">
                    {responses.length > 0 ? (
                        <div className="table-container">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>البريد الإلكتروني</th>
                                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>تاريخ الإرسال</th>
                                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {responses.map((response: any, idx: number) => (
                                        <tr key={response.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: 'var(--spacing-md)' }}>
                                                {response.respondent_email || `مجهول ${idx + 1}`}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)' }}>
                                                {new Date(response.submitted_at).toLocaleDateString('ar-SA')} {' '}
                                                {new Date(response.submitted_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)' }}>
                                                <button
                                                    onClick={() => {
                                                        const details = questions.map(q =>
                                                            `${q.question_text}\n→ ${response.responses[q.id] || 'لا يوجد رد'}`
                                                        ).join('\n\n')
                                                        alert(details)
                                                    }}
                                                    className="btn btn-sm btn-secondary"
                                                >
                                                    عرض التفاصيل
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
                            لا توجد ردود بعد
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Response {
    id: string
    responses: any
    created_at: string
}

interface Question {
    id: string
    question_text: string
    question_type: string
    options: any
    display_order: number
}

export default function SurveyResultsPage() {
    const params = useParams()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [survey, setSurvey] = useState<any>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [responses, setResponses] = useState<Response[]>([])
    const [viewingResponse, setViewingResponse] = useState<any>(null)

    useEffect(() => {
        if (params.id) {
            loadResults()
        }
    }, [params.id])

    const loadResults = async () => {
        try {
            // Load survey info
            const { data: surveyData, error: surveyError } = await supabase
                .from('surveys')
                .select('*')
                .eq('id', params.id)
                .single()

            if (surveyError) throw surveyError
            setSurvey(surveyData)

            // Load questions
            const { data: questionsData, error: qError } = await supabase
                .from('survey_questions')
                .select('*')
                .eq('survey_id', params.id)
                .order('display_order')

            if (qError) throw qError
            setQuestions(questionsData)

            // Load responses
            const { data: responsesData, error: rError } = await supabase
                .from('survey_responses')
                .select('*')
                .eq('survey_id', params.id)
                .order('created_at', { ascending: false })

            if (rError) throw rError
            console.log('Survey Results Debug:', {
                survey: surveyData,
                questionsCount: questionsData?.length,
                responsesCount: responsesData?.length,
                sampleResponse: (responsesData?.[0] as any)?.responses
            })
            setResponses(responsesData || [])

        } catch (error: any) {
            console.error('Error loading results:', error)
            alert('فشل تحميل النتائج: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const getQuestionStats = (questionId: string, type: string) => {
        if (!responses.length) return 'لا توجد إجابات بعد'

        let answers = responses.map(r => r.responses[questionId]).filter(v => v !== undefined && v !== null && v !== '')

        if (answers.length === 0) return 'لا توجد إجابات لهذا السؤال'

        if (type === 'rating') {
            const sum = answers.reduce((a: any, b: any) => Number(a) + Number(b), 0)
            const avg = (sum / answers.length).toFixed(1)
            return `المتوسط: ${avg} / 5 (${answers.length} إجابة)`
        }

        if (['yes_no', 'multiple_choice', 'select', 'radio', 'checkbox'].includes(type)) {
            const counts: any = {}
            answers.forEach((a: any) => {
                if (Array.isArray(a)) {
                    a.forEach(val => {
                        counts[val] = (counts[val] || 0) + 1
                    })
                } else {
                    counts[a] = (counts[a] || 0) + 1
                }
            })
            return (
                <div style={{ display: 'grid', gap: '4px' }}>
                    {Object.entries(counts).map(([key, value]: [string, any]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span>{key}:</span>
                            <span style={{ fontWeight: 600 }}>{value} ({((value / answers.length) * 100).toFixed(0)}%)</span>
                        </div>
                    ))}
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', borderTop: '1px solid var(--color-border)', paddingTop: '4px' }}>
                        إجمالي الإجابات: {answers.length}
                    </div>
                </div>
            )
        }

        // For text types, show the latest 3 answers
        return (
            <div style={{ display: 'grid', gap: '4px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    إجمالي الردود: {answers.length}
                </div>
                {answers.slice(0, 5).map((a: any, idx: number) => (
                    <div key={idx} style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--color-background)', borderRadius: '4px', borderRight: '3px solid var(--color-gold)' }}>
                        "{a}"
                    </div>
                ))}
                {answers.length > 5 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                        ... والمزيد في قائمة الاستجابات
                    </div>
                )}
            </div>
        )
    }

    if (loading) return <div className="loading" style={{ margin: '2rem auto' }}></div>
    if (!survey) return <div style={{ textAlign: 'center', padding: '2rem' }}>الاستبيان غير موجود</div>

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>نتائج: {survey.title}</h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
                    <span>عدد الأسئلة: {questions.length}</span>
                    <span>عدد الاستجابات: {responses.length}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gap: 'var(--spacing-xl)', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                <div>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📊 ملخص الإحصائيات
                    </h3>
                    {questions.map((question) => (
                        <div key={question.id} className="card hover-scale" style={{ marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)' }}>
                            <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.95rem', color: 'var(--color-text)' }}>{question.question_text}</h4>
                            <div style={{ color: 'var(--color-text-secondary)' }}>
                                {getQuestionStats(question.id, question.question_type)}
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📝 سجل الاستجابات التفصيلي
                    </h3>
                    <div className="card" style={{ padding: 0, maxHeight: '800px', overflowY: 'auto' }}>
                        <div className="table-container">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--color-background)', borderBottom: '2px solid var(--color-border)' }}>
                                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem' }}>المشارك</th>
                                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem' }}>التاريخ</th>
                                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.85rem' }}>الإجراء</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {responses.length > 0 ? responses.map((response: any, index) => (
                                        <tr key={response.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '12px' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                                    {response.respondent_email || 'مشارك مجهول'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                    {new Date(response.created_at).toLocaleDateString('ar-SA')}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => setViewingResponse(response)}
                                                    className="btn btn-sm btn-secondary"
                                                >
                                                    عرض
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                لا توجد استجابات بعد
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Response Modal */}
            {viewingResponse && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3000,
                    padding: 'var(--spacing-md)'
                }}>
                    <div className="card" style={{ maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button
                            onClick={() => setViewingResponse(null)}
                            style={{ position: 'absolute', top: 'var(--spacing-md)', left: 'var(--spacing-md)', fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                        >
                            ✕
                        </button>

                        <h2 style={{ marginBottom: 'var(--spacing-xl)', fontSize: '1.5rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: 'var(--spacing-xs)' }}>
                            تفاصيل الاستجابة
                        </h2>

                        <div style={{ marginBottom: 'var(--spacing-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>البريد الإلكتروني:</div>
                                <div style={{ fontWeight: 500 }}>{viewingResponse.respondent_email || 'غير متوفر'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>تاريخ الإرسال:</div>
                                <div style={{ fontWeight: 500 }}>{new Date(viewingResponse.created_at).toLocaleString('ar-SA')}</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                            {questions.map((q) => (
                                <div key={q.id} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-sm)' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '4px' }}>
                                        {q.question_text}:
                                    </div>
                                    <div style={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                                        {viewingResponse.responses[q.id] === undefined || viewingResponse.responses[q.id] === null || viewingResponse.responses[q.id] === '' ? (
                                            <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>لا توجد إجابة</span>
                                        ) : Array.isArray(viewingResponse.responses[q.id]) ? (
                                            viewingResponse.responses[q.id].join(', ')
                                        ) : (
                                            String(viewingResponse.responses[q.id])
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 'var(--spacing-xl)' }}>
                            <button onClick={() => setViewingResponse(null)} className="btn btn-primary" style={{ width: '100%' }}>
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

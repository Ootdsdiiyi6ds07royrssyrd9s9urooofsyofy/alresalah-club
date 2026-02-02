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
            setResponses(responsesData)

        } catch (error: any) {
            console.error('Error loading results:', error)
            alert('فشل تحميل النتائج')
        } finally {
            setLoading(false)
        }
    }

    const getQuestionStats = (questionId: string, type: string) => {
        if (!responses.length) return 'لا توجد إجابات بعد'

        const answers = responses.map(r => r.responses[questionId]).filter(Boolean)

        if (answers.length === 0) return 'لا توجد إجابات لهذا السؤال'

        if (type === 'rating') {
            const sum = answers.reduce((a: any, b: any) => Number(a) + Number(b), 0)
            const avg = (sum / answers.length).toFixed(1)
            return `المتوسط: ${avg} / 5 (${answers.length} إجابة)`
        }

        if (type === 'yes_no' || type === 'multiple_choice') {
            const counts: any = {}
            answers.forEach((a: any) => {
                counts[a] = (counts[a] || 0) + 1
            })
            return Object.entries(counts)
                .map(([key, value]) => `${key}: ${value}`)
                .join(' | ')
        }

        return `تمت الإجابة ${answers.length} مرة (نص)`
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

            <div style={{ display: 'grid', gap: 'var(--spacing-xl)', gridTemplateColumns: '1fr 1fr' }}>
                <div>
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
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>آخر الاستجابات</h3>
                    <div className="card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {responses.map((response, index) => (
                            <div key={response.id} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                                    {new Date(response.created_at).toLocaleDateString('ar-SA')} - {new Date(response.created_at).toLocaleTimeString('ar-SA')}
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    استجابة #{responses.length - index}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSurveysPage() {
    const router = useRouter()
    const supabase = createClient()
    const [surveys, setSurveys] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSurveys()
    }, [])

    const loadSurveys = async () => {
        const { data } = await supabase
            .from('surveys')
            .select('*, courses(title)')
            .order('created_at', { ascending: false })
        setSurveys(data || [])
        setLoading(false)
    }

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`هل أنت متأكد من حذف الاستبيان "${title}"؟`)) return

        const { error } = await supabase
            .from('surveys')
            .delete()
            .eq('id', id)

        if (error) {
            alert('فشل الحذف: ' + error.message)
        } else {
            alert('تم الحذف بنجاح')
            loadSurveys()
        }
    }

    if (loading) return <div className="loading" style={{ margin: '2rem auto' }}></div>

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-2xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>الاستبيانات</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        إدارة استبيانات مستوى الرضا والتقييم
                    </p>
                </div>
                <a href="/admin/dashboard/surveys/new" className="btn btn-primary">+ إضافة استبيان جديد</a>
            </div>

            <div className="card">
                {surveys && surveys.length > 0 ? (
                    <div className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>عنوان الاستبيان</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الدورة</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الحالة</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>تاريخ البدء</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {surveys.map((survey: any) => (
                                    <tr key={survey.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{survey.title}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{survey.courses?.title || 'عام'}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <span className={`badge badge-${survey.is_active ? 'success' : 'muted'}`}>
                                                {survey.is_active ? 'نشط' : 'غير نشط'}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            {survey.start_date ? new Date(survey.start_date).toLocaleDateString('ar-SA') : 'غير محدد'}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <button
                                                onClick={() => router.push(`/admin/dashboard/surveys/${survey.id}/edit`)}
                                                className="btn btn-sm btn-secondary"
                                                style={{ marginLeft: 'var(--spacing-xs)' }}
                                            >
                                                تعديل
                                            </button>
                                            <button
                                                onClick={() => router.push(`/admin/dashboard/surveys/${survey.id}/results`)}
                                                className="btn btn-sm btn-info"
                                                style={{ marginLeft: 'var(--spacing-xs)' }}
                                            >
                                                النتائج
                                            </button>
                                            <button
                                                onClick={() => handleDelete(survey.id, survey.title)}
                                                className="btn btn-sm btn-error"
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                            لا توجد استبيانات مضافة حالياً
                        </p>
                        <a href="/admin/dashboard/surveys/new" className="btn btn-primary">+ إنشاء أول استبيان</a>
                    </div>
                )}
            </div>
        </div>
    )
}

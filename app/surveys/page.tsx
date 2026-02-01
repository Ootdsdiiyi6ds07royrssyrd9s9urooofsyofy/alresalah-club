import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
    title: 'الاستبيانات - نادي الرسالة',
    description: 'شارك برأيك من خلال استبياناتنا العامة'
}

export default async function SurveysPage() {
    const supabase = await createClient()

    const { data: surveys, error } = await (supabase
        .from('surveys')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false }) as any)

    if (error) {
        console.error('Error fetching surveys:', error)
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>الاستبيانات</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                    شارك برأيك وساعدنا في تحسين خدماتنا من خلال استبياناتنا
                </p>
            </div>

            {surveys && surveys.length > 0 ? (
                <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    {surveys.map((survey: any) => (
                        <div key={survey.id} className="card">
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>
                                    {survey.title}
                                </h2>
                                {survey.description && (
                                    <p style={{ color: 'var(--color-text-secondary)' }}>
                                        {survey.description}
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                                    {survey.start_date && (
                                        <span>📅 يبدأ: {new Date(survey.start_date).toLocaleDateString('ar-SA')}</span>
                                    )}
                                    {survey.end_date && (
                                        <span>⏰ ينتهي: {new Date(survey.end_date).toLocaleDateString('ar-SA')}</span>
                                    )}
                                </div>
                                <Link href={`/surveys/${survey.id}`} className="btn btn-primary">
                                    ابدأ الاستبيان
                                </Link>
                            </div>

                            {survey.course_id && (
                                <div style={{ marginTop: 'var(--spacing-sm)', padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                        📚 مرتبط بدورة معينة
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📊</div>
                    <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>لا توجد استبيانات متاحة حالياً</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        تابعنا للحصول على استبيانات جديدة قريباً
                    </p>
                </div>
            )}
        </div>
    )
}

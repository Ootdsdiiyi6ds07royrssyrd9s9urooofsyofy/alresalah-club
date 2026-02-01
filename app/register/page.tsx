import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function RegistrationIndexPage() {
    const supabase = await createClient()

    const { data: forms } = await supabase
        .from('registration_forms')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-surface)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>نماذج التسجيل المتاحة</h1>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        اختر النموذج المناسب للتسجيل في برامجنا ودوراتنا.
                    </p>
                </div>

                {forms && forms.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-xl)' }}>
                        {forms.map((form: any) => (
                            <div key={form.id} className="card hover-scale" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>{form.title}</h2>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                        {new Date(form.created_at).toLocaleDateString('ar-SA')}
                                    </p>
                                </div>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', flex: 1 }}>
                                    {form.description || 'لا يوجد وصف متاح.'}
                                </p>
                                <Link href={`/register/${form.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                                    التسجيل الآن ←
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                        <h3>لا توجد نماذج تسجيل نشطة حالياً</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                            يرجى مراجعة صفحة الدورات والبرامج لمعرفة المزيد عن أنشطتنا القادمة.
                        </p>
                        <Link href="/courses" className="btn btn-primary">
                            تصفح الدورات
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

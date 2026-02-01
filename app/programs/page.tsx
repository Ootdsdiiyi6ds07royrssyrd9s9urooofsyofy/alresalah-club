import { createClient } from '@/lib/supabase/server'

export default async function ProgramsPage() {
    const supabase = await createClient()
    const { data: programs } = await supabase
        .from('programs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    return (
        <div style={{ padding: 'var(--spacing-2xl) 0', minHeight: '60vh', background: 'var(--color-background)' }}>
            <div className="container">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <a href="/" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', width: 'fit-content' }}>
                        <span>←</span> العودة للرئيسية
                    </a>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 className="gradient-text" style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-sm)' }}>برامجنا النوعية</h1>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        نقدم مجموعة متنوعة من البرامج الإثرائية المصممة لبناء الجيل القادم
                    </p>
                </div>

                {programs && programs.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-xl)' }}>
                        {programs.map((program) => (
                            <div key={program.id} className="card hover-scale fade-in" style={{ padding: 0, overflow: 'hidden' }}>
                                {program.image_url ? (
                                    <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                                        <img src={program.image_url} alt={program.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', top: 'var(--spacing-sm)', right: 'var(--spacing-sm)' }}>
                                            <span className="badge badge-primary">{program.category || 'عام'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ height: '200px', width: '100%', background: 'var(--grad-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                        🎓
                                        <div style={{ position: 'absolute', top: 'var(--spacing-sm)', right: 'var(--spacing-sm)' }}>
                                            <span className="badge badge-primary">{program.category || 'عام'}</span>
                                        </div>
                                    </div>
                                )}
                                <div style={{ padding: 'var(--spacing-lg)' }}>
                                    <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>{program.title}</h3>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)', minHeight: '3em' }}>
                                        {program.description}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                                            <span>⏱️</span>
                                            <span>{program.duration || 'غير محدد'}</span>
                                        </div>
                                        <button className="btn btn-secondary btn-sm">تعرف أكثر</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>✨</div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>برامجنا قادمة قريباً</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>نعمل حالياً على تجهيز باقة من البرامج المميزة.</p>
                    </div>
                )}

                <div style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
                    <a href="/" className="btn btn-primary btn-lg">العودة للرئيسية</a>
                </div>
            </div>
        </div>
    )
}

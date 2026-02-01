import { createClient } from '@/lib/supabase/server'

export default async function AnnouncementsPage() {
    const supabase = await createClient()
    const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .lte('publish_date', new Date().toISOString())
        .gte('expiration_date', new Date().toISOString())
        .order('publish_date', { ascending: false })

    return (
        <div style={{ padding: 'var(--spacing-2xl) 0', minHeight: '60vh', background: 'var(--color-background)' }}>
            <div className="container">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <a href="/" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', width: 'fit-content' }}>
                        <span>←</span> العودة للرئيسية
                    </a>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 className="gradient-text" style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-sm)' }}>الإعلانات والتنبيهات</h1>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        ابقوا على اطلاع بآخر أخبار وفعاليات نادي الرسالة
                    </p>
                </div>

                {announcements && announcements.length > 0 ? (
                    <div style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: '900px', margin: '0 auto' }}>
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className="card fade-in" style={{ borderRight: `4px solid ${announcement.priority === 'urgent' ? 'var(--color-error)' : announcement.priority === 'high' ? 'var(--color-warning)' : 'var(--color-primary)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                                    <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text)' }}>{announcement.title}</h3>
                                    <span className={`badge badge-${announcement.priority === 'urgent' ? 'error' : announcement.priority === 'high' ? 'warning' : 'primary'}`} style={{ padding: '4px 12px' }}>
                                        {announcement.priority === 'urgent' ? 'عاجل جداً' : announcement.priority === 'high' ? 'هام' : 'إعلان'}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: '1.8', marginBottom: 'var(--spacing-lg)' }}>
                                    {announcement.content}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        {new Date(announcement.publish_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <button className="btn btn-secondary btn-sm">عرض التفاصيل</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📢</div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>لا توجد إعلانات حالياً</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>سنقوم بنشر الإعلانات الجديدة هنا فور صدورها.</p>
                    </div>
                )}

                <div style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
                    <a href="/" className="btn btn-primary btn-lg">العودة للرئيسية</a>
                </div>
            </div>
        </div>
    )
}

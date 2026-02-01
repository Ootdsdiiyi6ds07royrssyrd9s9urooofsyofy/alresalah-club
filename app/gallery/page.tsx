import { createClient } from '@/lib/supabase/server'

export default async function GalleryPage() {
    const supabase = await createClient()
    const { data: media } = await supabase
        .from('media_gallery')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div style={{ padding: 'var(--spacing-2xl) 0', minHeight: '80vh', background: 'var(--color-background)' }}>
            <div className="container">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <a href="/" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', width: 'fit-content' }}>
                        <span>←</span> العودة للرئيسية
                    </a>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 className="gradient-text" style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-sm)' }}>معرض الوسائط</h1>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        لحظات مميزة من فعاليات وبرامج نادي الرسالة
                    </p>
                </div>

                {media && media.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)'
                    }}>
                        {media.map((item) => (
                            <div key={item.id} className="card hover-scale fade-in" style={{ padding: 0, overflow: 'hidden', position: 'relative', cursor: 'pointer', height: '240px' }}>
                                <img
                                    src={item.file_url}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                    padding: 'var(--spacing-md) var(--spacing-sm)',
                                    color: 'white',
                                    opacity: 0,
                                    transition: 'opacity var(--transition-base)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end'
                                }} className="gallery-overlay">
                                    <h4 style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>{item.title}</h4>
                                    {item.category && <span style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>{item.category}</span>}
                                </div>
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                    .card:hover .gallery-overlay { opacity: 1 !important; }
                                `}} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📸</div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>المعرض فارغ حالياً</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>قريباً سنقوم بمشاركة صور وفيديوهات من أنشطتنا.</p>
                    </div>
                )}

                <div style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
                    <a href="/" className="btn btn-primary btn-lg">العودة للرئيسية</a>
                </div>
            </div>
        </div>
    )
}

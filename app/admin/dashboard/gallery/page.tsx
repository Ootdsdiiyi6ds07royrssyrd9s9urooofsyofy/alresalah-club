import { createClient } from '@/lib/supabase/server'

export default async function AdminGalleryPage() {
    const supabase = await createClient()
    const { data: media } = await supabase
        .from('media_gallery')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-2xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>معرض الوسائط</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        رفع وإدارة الصور والفيديوهات في معرض النادي
                    </p>
                </div>
                <a href="/admin/dashboard/gallery/new" className="btn btn-primary">+ رفع وسائط جديدة</a>
            </div>

            <div className="card">
                {media && media.length > 0 ? (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: 'var(--spacing-md)',
                        }}
                    >
                        {media.map((item: any) => (
                            <div
                                key={item.id}
                                style={{
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background)',
                                }}
                            >
                                <div style={{ height: '150px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {item.media_type === 'image' ? (
                                        <img src={item.file_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ fontSize: '2rem' }}>🎥</div>
                                    )}
                                </div>
                                <div style={{ padding: 'var(--spacing-sm)' }}>
                                    <p style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.title}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-xs)' }}>
                                        <a href={`/admin/dashboard/gallery/${item.id}/edit`} className="btn btn-sm btn-secondary">تعديل</a>
                                        <button className="btn btn-sm btn-error">حذف</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                            لا توجد وسائط مضافة حالياً
                        </p>
                        <a href="/admin/dashboard/gallery/new" className="btn btn-primary">+ رفع أول صورة/فيديو</a>
                    </div>
                )}
            </div>
        </div>
    )
}

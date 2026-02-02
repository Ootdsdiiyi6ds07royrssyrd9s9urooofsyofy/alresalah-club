'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function AdminGalleryPage() {
    const supabase = createClient()
    const [media, setMedia] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadMedia()
    }, [])

    const loadMedia = async () => {
        const { data } = await supabase
            .from('media_gallery')
            .select('*')
            .order('created_at', { ascending: false })
        setMedia(data || [])
        setLoading(false)
    }

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`هل أنت متأكد من حذف "${title}" من المعرض؟`)) return

        const { error } = await supabase
            .from('media_gallery')
            .delete()
            .eq('id', id)

        if (error) {
            alert('فشل الحذف: ' + error.message)
        } else {
            alert('تم الحذف بنجاح')
            loadMedia()
        }
    }

    if (loading) return <div className="loading" style={{ margin: '2rem auto' }}></div>

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
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ height: '150px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {item.media_type === 'image' ? (
                                        <img src={item.file_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ fontSize: '2rem' }}>🎥</div>
                                    )}
                                </div>
                                <div style={{ padding: 'var(--spacing-sm)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 'var(--spacing-sm)' }}>
                                        {item.title}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', gap: 'var(--spacing-xs)' }}>
                                        <a href={`/admin/dashboard/gallery/${item.id}/edit`} className="btn btn-sm btn-secondary" style={{ flex: 1 }}>تعديل</a>
                                        <button
                                            onClick={() => handleDelete(item.id, item.title)}
                                            className="btn btn-sm btn-error"
                                            style={{ flex: 1 }}
                                        >
                                            حذف
                                        </button>
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

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewMediaPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        media_type: 'image',
        file_url: '',
        category: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase
            .from('media_gallery')
            .insert([formData])

        setLoading(false)

        if (error) {
            alert('حدث خطأ أثناء إضافة الوسائط: ' + error.message)
        } else {
            router.push('/admin/dashboard/gallery')
            router.refresh()
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>إضافة وسائط جديدة</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>أضف صوراً أو فيديوهات لمعرض النادي</p>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                    <label className="label">العنوان</label>
                    <input
                        type="text"
                        required
                        className="input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                        <label className="label">نوع الوسائط</label>
                        <select
                            className="input"
                            value={formData.media_type}
                            onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                        >
                            <option value="image">صورة</option>
                            <option value="video">فيديو</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label">الفئة</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="مثال: حفلات، دورات"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">رابط الملف (URL)</label>
                    <input
                        type="url"
                        required
                        className="input"
                        value={formData.file_url}
                        onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                    />
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '5px' }}>
                        ملاحظة: يمكنك استخدام روابط مباشرة من Supabase Storage أو أي خدمة استضافة صور.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                    <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    )
}

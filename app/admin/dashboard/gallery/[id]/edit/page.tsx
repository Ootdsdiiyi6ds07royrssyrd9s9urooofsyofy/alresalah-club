'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react'

export default function EditGalleryPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        media_type: 'image',
        file_url: '',
        category: ''
    })

    useEffect(() => {
        fetchMedia()
    }, [])

    const fetchMedia = async () => {
        const { data, error } = await supabase
            .from('media_gallery')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error) {
            console.error('Error fetching media:', error)
            alert('فشل تحميل بيانات الوسائط')
        } else {
            setFormData({
                title: data.title,
                media_type: data.media_type,
                file_url: data.file_url,
                category: data.category || ''
            })
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('media_gallery')
            .update(formData)
            .eq('id', params.id)

        setSaving(false)

        if (error) {
            alert('حدث خطأ أثناء حفظ التعديلات: ' + error.message)
        } else {
            alert('تم حفظ التعديلات بنجاح')
            router.push('/admin/dashboard/gallery')
            router.refresh()
        }
    }

    const handleDelete = async () => {
        if (!confirm(`هل أنت متأكد من حذف "${formData.title}" من المعرض؟`)) return

        setSaving(true)
        const { error } = await supabase
            .from('media_gallery')
            .delete()
            .eq('id', params.id)

        if (error) {
            alert('فشل الحذف: ' + error.message)
            setSaving(false)
        } else {
            alert('تم الحذف بنجاح')
            router.push('/admin/dashboard/gallery')
            router.refresh()
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Loader2 className="animate-spin" size={32} />
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <button onClick={() => router.back()} className="btn btn-ghost" style={{ padding: '8px' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>تعديل الوسائط</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>تعديل بيانات الصورة أو الفيديو في المعرض</p>
                </div>
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
                    />
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                        </button>
                        <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                            إلغاء
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn btn-error"
                        disabled={saving}
                        style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                        <Trash2 size={18} />
                        حذف من المعرض
                    </button>
                </div>
            </form>
        </div>
    )
}

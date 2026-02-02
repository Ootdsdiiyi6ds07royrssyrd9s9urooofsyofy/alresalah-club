'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react'

type Announcement = Database['public']['Tables']['announcements']['Row']

export default function EditAnnouncementPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<Announcement>>({
        title: '',
        content: '',
        priority: 'normal',
        publish_date: '',
        is_active: true
    })

    useEffect(() => {
        fetchAnnouncement()
    }, [])

    const fetchAnnouncement = async () => {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error) {
            console.error('Error fetching announcement:', error)
            alert('فشل تحميل بيانات الإعلان')
        } else {
            setFormData(data)
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('announcements')
            .update(formData)
            .eq('id', params.id)

        setSaving(false)

        if (error) {
            alert('حدث خطأ أثناء حفظ التعديلات: ' + error.message)
        } else {
            alert('تم حفظ التعديلات بنجاح')
            router.push('/admin/dashboard/announcements')
            router.refresh()
        }
    }

    const handleDelete = async () => {
        if (!confirm(`هل أنت متأكد من حذف إعلان "${formData.title}"؟`)) return

        setSaving(true)
        const { error } = await supabase
            .from('announcements')
            .delete()
            .eq('id', params.id)

        if (error) {
            alert('فشل الحذف: ' + error.message)
            setSaving(false)
        } else {
            alert('تم الحذف بنجاح')
            router.push('/admin/dashboard/announcements')
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
                    <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>تعديل الإعلان</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>تعديل تفاصيل الإعلان المنشور</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                    <label className="label">عنوان الإعلان</label>
                    <input
                        type="text"
                        required
                        className="input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="label">المحتوى</label>
                    <textarea
                        className="input"
                        required
                        style={{ minHeight: '150px', padding: '10px' }}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                        <label className="label">الأولوية</label>
                        <select
                            className="input"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        >
                            <option value="normal">عادي</option>
                            <option value="urgent">عاجل 🔴</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label">تاريخ النشر</label>
                        <input
                            type="date"
                            className="input"
                            value={formData.publish_date?.split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                        />
                    </div>
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
                        حذف الإعلان
                    </button>
                </div>
            </form>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert']

export default function NewAnnouncementPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<AnnouncementInsert>({
        title: '',
        content: '',
        priority: 'normal',
        publish_date: new Date().toISOString().split('T')[0],
        is_active: true
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await (supabase
            .from('announcements') as any)
            .insert([formData])

        setLoading(false)

        if (error) {
            alert('حدث خطأ أثناء إضافة الإعلان: ' + error.message)
        } else {
            router.push('/admin/dashboard/announcements')
            router.refresh()
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>إضافة إعلان جديد</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>تواصل مع أعضاء النادي بآخر الأخبار</p>
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
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                            value={formData.publish_date}
                            onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'جاري النشر...' : 'نشر الإعلان'}
                    </button>
                    <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    )
}

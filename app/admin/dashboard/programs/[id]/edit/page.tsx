'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react'

export default function EditProgramPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        category: '',
        instructor: '',
        start_date: '',
        end_date: '',
        location: '',
        price: 0,
        total_seats: 0,
        available_seats: 0,
        is_active: true
    })

    useEffect(() => {
        fetchProgram()
    }, [])

    const fetchProgram = async () => {
        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .eq('id', params.id)
            .single()

        const programData = data as any;

        if (error) {
            console.error('Error fetching program:', error)
            alert('فشل تحميل بيانات البرنامج')
        } else {
            setFormData({
                title: programData.title,
                description: programData.description || '',
                duration: programData.duration || '',
                category: programData.category || '',
                instructor: programData.instructor || '',
                start_date: programData.start_date || '',
                end_date: programData.end_date || '',
                location: programData.location || '',
                price: programData.price || 0,
                total_seats: programData.total_seats || 0,
                available_seats: programData.available_seats || 0,
                is_active: programData.is_active
            })
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('programs')
            .update(formData)
            .eq('id', params.id)

        setSaving(false)

        if (error) {
            alert('حدث خطأ أثناء حفظ التعديلات: ' + error.message)
        } else {
            alert('تم حفظ التعديلات بنجاح')
            router.push('/admin/dashboard/programs')
            router.refresh()
        }
    }

    const handleDelete = async () => {
        if (!confirm(`هل أنت متأكد من حذف برنامج "${formData.title}"؟`)) return

        setSaving(true)
        const { error } = await supabase
            .from('programs')
            .delete()
            .eq('id', params.id)

        if (error) {
            alert('فشل الحذف: ' + error.message)
            setSaving(false)
        } else {
            alert('تم الحذف بنجاح')
            router.push('/admin/dashboard/programs')
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
                    <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>تعديل البرنامج</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>تعديل تفاصيل البرنامج التعليمي</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                    <label className="label">عنوان البرنامج</label>
                    <input
                        type="text"
                        required
                        className="input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="label">الوصف</label>
                    <textarea
                        className="input"
                        style={{ minHeight: '100px', padding: '10px' }}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                        <label className="label">المحاضر / المسؤول</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.instructor}
                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">الموقع</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="مثال: قاعة النادي، عن بعد"
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                        <label className="label">السعر</label>
                        <input
                            type="number"
                            className="input"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">إجمالي المقاعد</label>
                        <input
                            type="number"
                            className="input"
                            value={formData.total_seats}
                            onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value), available_seats: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">الفئة</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                        <label className="label">تاريخ البدء</label>
                        <input
                            type="date"
                            className="input"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">تاريخ الانتهاء</label>
                        <input
                            type="date"
                            className="input"
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">المدة</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
                        حذف البرنامج
                    </button>
                </div>
            </form>
        </div>
    )
}

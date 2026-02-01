'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewCoursePage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        start_date: '',
        end_date: '',
        total_seats: 30,
        price: 0,
        is_active: true
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase
            .from('courses')
            .insert([{
                ...formData,
                available_seats: formData.total_seats
            }])

        setLoading(false)

        if (error) {
            alert('حدث خطأ أثناء إضافة الدورة: ' + error.message)
        } else {
            router.push('/admin/dashboard/courses')
            router.refresh()
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>إضافة دورة جديدة</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>أدخل تفاصيل الدورة التدريبية الجديدة</p>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                    <label className="label">عنوان الدورة</label>
                    <input
                        type="text"
                        required
                        className="input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="مثال: دورة الذكاء الاصطناعي"
                    />
                </div>

                <div className="form-group">
                    <label className="label">الوصف</label>
                    <textarea
                        className="input"
                        style={{ minHeight: '100px', padding: '10px' }}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="وصف تفصيلي للدورة..."
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                        <label className="label">المحاضر</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.instructor}
                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">السعر (ريال)</label>
                        <input
                            type="number"
                            className="input"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
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
                </div>

                <div className="form-group">
                    <label className="label">إجمالي المقاعد</label>
                    <input
                        type="number"
                        className="input"
                        value={formData.total_seats}
                        onChange={(e) => setFormData({ ...formData, total_seats: Number(e.target.value) })}
                    />
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'جاري الحفظ...' : 'حفظ الدورة'}
                    </button>
                    <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    )
}

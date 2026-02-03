'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewProgramPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase
            .from('programs')
            .insert([formData])

        setLoading(false)

        if (error) {
            alert('حدث خطأ أثناء إضافة البرنامج: ' + error.message)
        } else {
            router.push('/admin/dashboard/programs')
            router.refresh()
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>إضافة برنامج جديد</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>أدخل تفاصيل البرنامج التعليمي المتميز</p>
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
                            placeholder="مثال: تربوي، تقني"
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
                            placeholder="مثال: 3 أشهر"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'جاري الحفظ...' : 'حفظ البرنامج'}
                    </button>
                    <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    )
}

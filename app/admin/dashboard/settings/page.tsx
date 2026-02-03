'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SmartLearnerSettings() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [learner, setLearner] = useState({
        name: 'عبدالله بن محمد',
        title: 'متعلم متميز',
        cohort: 'دفعة 2025',
        description: 'نكرم في كل عام الطالب الأكثر تميزاً ومشاركة في برامجنا التدريبية. الطالب الذي أثبت جدارته بالتفوق والابتكار.',
        image_url: ''
    })

    useEffect(() => {
        async function fetchSettings() {
            const { data, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('id', 'smart_learner')
                .single() as any

            if (data) {
                // Ensure image_url exists in merged state
                setLearner({ ...learner, ...data.value } as any)
            }
            setLoading(false)
        }
        fetchSettings()
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }

        const file = e.target.files[0]
        setUploading(true)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `smart-learner-${Date.now()}.${fileExt}`
            const filePath = `learner/${fileName}`

            // Try to upload to 'media' bucket first (assuming it exists from previous tasks)
            // If it fails, we might need to create it or use 'public'
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('media').getPublicUrl(filePath)

            setLearner(prev => ({ ...prev, image_url: data.publicUrl }))
        } catch (error: any) {
            alert('فشل رفع الصورة: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('site_settings')
            .upsert({ id: 'smart_learner', value: learner } as any)

        setSaving(false)

        if (error) {
            console.error('Error saving settings:', error)
            alert('حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى لاحقاً.')
        } else {
            alert('تم حفظ التغييرات بنجاح')
        }
    }

    if (loading) return <div>جاري التحميل...</div>

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>إدارة المتعلم الذكي</h1>

            <form onSubmit={handleSave} className="card" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                    <label className="label">اسم المتعلم</label>
                    <input
                        className="input"
                        value={learner.name}
                        onChange={e => setLearner({ ...learner, name: e.target.value })}
                    />
                </div>



                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                        <label className="label">اللقب</label>
                        <input
                            className="input"
                            value={learner.title}
                            onChange={e => setLearner({ ...learner, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">الدفعة / السنة</label>
                        <input
                            className="input"
                            value={learner.cohort}
                            onChange={e => setLearner({ ...learner, cohort: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">الوصف التكريمي</label>
                    <textarea
                        className="input"
                        style={{ minHeight: '100px', padding: '10px' }}
                        value={learner.description}
                        onChange={e => setLearner({ ...learner, description: e.target.value })}
                    />
                </div>

                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </form>

        </div>
    )
}


'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, Trophy, Mail, Phone, MapPin, Globe, Instagram, Twitter, Linkedin, Youtube, CheckCircle, AlertCircle, Facebook } from 'lucide-react'

export default function SettingsPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

    // Smart Learner State
    const [smartLearner, setSmartLearner] = useState({
        name: '',
        title: '',
        cohort: '',
        description: '',
        image_url: ''
    })

    // Contact Info State
    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: '',
        address: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        facebook: ''
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .in('id', ['smart_learner', 'contact_info'])

            if (error) throw error

            if (data) {
                const smartData = data.find(d => d.id === 'smart_learner')?.value
                if (smartData) setSmartLearner(smartData)

                const contactData = data.find(d => d.id === 'contact_info')?.value
                if (contactData) setContactInfo(contactData)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSmartLearnerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSmartLearner({ ...smartLearner, [e.target.name]: e.target.value })
    }

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContactInfo({ ...contactInfo, [e.target.name]: e.target.value })
    }

    const saveSettings = async () => {
        setSaving(true)
        setSaveStatus('idle')
        try {
            const updates = [
                {
                    id: 'smart_learner',
                    value: smartLearner,
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'contact_info',
                    value: contactInfo,
                    updated_at: new Date().toISOString()
                }
            ]

            const { error } = await supabase
                .from('site_settings')
                .upsert(updates)

            if (error) throw error
            setSaveStatus('success')
            setTimeout(() => setSaveStatus('idle'), 3000)
        } catch (error: any) {
            console.error('Error saving:', error)
            setSaveStatus('error')
            setTimeout(() => setSaveStatus('idle'), 3000)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-2xl)' }}>
                <div className="loading" style={{ width: '40px', height: '40px' }}></div>
                <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>جاري تحميل الإعدادات...</p>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
            {/* Header */}
            <div className="card" style={{
                background: 'var(--grad-navy)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--spacing-md)'
            }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>إعدادات الموقع</h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--font-size-sm)' }}>قم بتخصيص معلومات الموقع والتواصل والمظهر</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className={`btn ${saveStatus === 'success' ? 'btn-success' : saveStatus === 'error' ? 'btn-danger' : 'btn-accent'}`}
                    style={{ minWidth: '160px' }}
                >
                    {saving ? (
                        <>
                            <div className="loading" style={{ width: '18px', height: '18px', borderTopColor: 'currentColor' }}></div>
                            جاري الحفظ...
                        </>
                    ) : saveStatus === 'success' ? (
                        <>
                            <CheckCircle size={20} />
                            تم الحفظ بنجاح
                        </>
                    ) : saveStatus === 'error' ? (
                        <>
                            <AlertCircle size={20} />
                            حدث خطأ
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            حفظ التغييرات
                        </>
                    )}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-xl)' }}>
                {/* Smart Learner Section */}
                <div className="card-elevated" style={{ overflow: 'hidden', padding: 0 }}>
                    <div style={{ background: 'var(--grad-gold)', padding: 'var(--spacing-lg)', color: 'var(--color-navy)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <div style={{ background: 'rgba(0,0,0,0.1)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)' }}>
                                <Trophy size={28} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>المتعلم الذكي</h2>
                                <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>لقب العام - يظهر في الصفحة الرئيسية كفخر للنادي</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: 'var(--spacing-xl)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
                            <div className="form-group">
                                <label className="label">اسم الطالب</label>
                                <input
                                    name="name"
                                    value={smartLearner.name}
                                    onChange={handleSmartLearnerChange}
                                    className="input"
                                    placeholder="أدخل اسم الطالب"
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">اللقب / المسمى</label>
                                <input
                                    name="title"
                                    value={smartLearner.title}
                                    onChange={handleSmartLearnerChange}
                                    className="input"
                                    placeholder="مثال: متعلم متميز"
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">الدفعة / السنة</label>
                                <input
                                    name="cohort"
                                    value={smartLearner.cohort}
                                    onChange={handleSmartLearnerChange}
                                    className="input"
                                    placeholder="مثال: دفعة 2025"
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="label">الوصف / نص التكريم</label>
                                <textarea
                                    name="description"
                                    value={smartLearner.description}
                                    onChange={handleSmartLearnerChange}
                                    rows={4}
                                    className="input"
                                    style={{ resize: 'none' }}
                                    placeholder="اكتب نص التكريم هنا بأسلوب بليغ..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="card-elevated" style={{ overflow: 'hidden', padding: 0 }}>
                    <div style={{ background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)', padding: 'var(--spacing-lg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <div style={{ color: 'var(--color-primary)' }}>
                                <Globe size={28} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--color-text)' }}>معلومات التواصل</h2>
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>تظهر هذه المعلومات في تذييل الموقع وصفحة تواصل معنا</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                        {/* Basic Contact Info */}
                        <div>
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <span style={{ width: '4px', height: '18px', background: 'var(--color-primary)', borderRadius: '2px' }}></span>
                                قنوات الاتصال الأساسية
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="label flex items-center gap-2">
                                        <Mail size={16} /> البريد الإلكتروني
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={contactInfo.email}
                                        onChange={handleContactChange}
                                        className="input"
                                        dir="ltr"
                                        placeholder="info@alresalah.club"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label flex items-center gap-2">
                                        <Phone size={16} /> رقم الهاتف
                                    </label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={contactInfo.phone}
                                        onChange={handleContactChange}
                                        className="input"
                                        dir="ltr"
                                        placeholder="+966 XX XXX XXXX"
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="label flex items-center gap-2">
                                        <MapPin size={16} /> العنوان الوطني / المقر
                                    </label>
                                    <input
                                        name="address"
                                        value={contactInfo.address}
                                        onChange={handleContactChange}
                                        className="input"
                                        placeholder="المدينة، الحي، الشارع، رقم المبنى"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <span style={{ width: '4px', height: '18px', background: 'var(--color-accent)', borderRadius: '2px' }}></span>
                                منصات التواصل الاجتماعي
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="label flex items-center gap-2">
                                        <Twitter size={16} color="#1DA1F2" /> منصة X (تويتر)
                                    </label>
                                    <input
                                        name="twitter"
                                        value={contactInfo.twitter}
                                        onChange={handleContactChange}
                                        className="input"
                                        dir="ltr"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label flex items-center gap-2">
                                        <Instagram size={16} color="#E1306C" /> إنستقرام
                                    </label>
                                    <input
                                        name="instagram"
                                        value={contactInfo.instagram}
                                        onChange={handleContactChange}
                                        className="input"
                                        dir="ltr"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label flex items-center gap-2">
                                        <Linkedin size={16} color="#0077B5" /> لينكد إن
                                    </label>
                                    <input
                                        name="linkedin"
                                        value={contactInfo.linkedin}
                                        onChange={handleContactChange}
                                        className="input"
                                        dir="ltr"
                                        placeholder="https://linkedin.com/..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label flex items-center gap-2">
                                        <Youtube size={16} color="#FF0000" /> يوتيوب
                                    </label>
                                    <input
                                        name="youtube"
                                        value={contactInfo.youtube}
                                        onChange={handleContactChange}
                                        className="input"
                                        dir="ltr"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label flex items-center gap-2">
                                        <Facebook size={16} color="#1877F2" /> فيسبوك
                                    </label>
                                    <input
                                        name="facebook"
                                        value={contactInfo.facebook}
                                        onChange={handleContactChange}
                                        className="input"
                                        dir="ltr"
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .btn-success {
                    background-color: var(--color-success);
                    color: white;
                }
                .btn-danger {
                    background-color: var(--color-error);
                    color: white;
                }
            `}</style>
        </div>
    )
}


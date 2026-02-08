
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, Trophy, Mail, Phone, MapPin, Globe, Instagram, Twitter, Linkedin, Youtube, Facebook } from 'lucide-react'

export default function SettingsPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

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
            alert('تم حفظ الإعدادات بنجاح')
        } catch (error: any) {
            console.error('Error saving:', error)
            alert('حدث خطأ أثناء الحفظ')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">إعدادات الموقع</h1>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Save size={20} />
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>

            {/* Smart Learner Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6 border-b dark:border-gray-700 pb-4">
                    <Trophy className="text-yellow-500" />
                    <h2 className="text-xl font-bold">المتعلم الذكي (لقب العام)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label">اسم الطالب</label>
                        <input name="name" value={smartLearner.name} onChange={handleSmartLearnerChange} className="input" />
                    </div>
                    <div>
                        <label className="label">اللقب / المسمى</label>
                        <input name="title" value={smartLearner.title} onChange={handleSmartLearnerChange} className="input" />
                    </div>
                    <div>
                        <label className="label">الدفعة / السنة</label>
                        <input name="cohort" value={smartLearner.cohort} onChange={handleSmartLearnerChange} className="input" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="label">الوصف / نص التكريم</label>
                        <textarea name="description" value={smartLearner.description} onChange={handleSmartLearnerChange} className="input h-24" />
                    </div>
                </div>
            </div>

            {/* Contact Info Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6 border-b dark:border-gray-700 pb-4">
                    <Globe className="text-blue-500" />
                    <h2 className="text-xl font-bold">معلومات التواصل (تظهر في تذييل الموقع)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label flex items-center gap-2"><Mail size={16} /> البريد الإلكتروني</label>
                        <input name="email" type="email" value={contactInfo.email} onChange={handleContactChange} className="input" dir="ltr" />
                    </div>
                    <div>
                        <label className="label flex items-center gap-2"><Phone size={16} /> رقم الهاتف</label>
                        <input name="phone" type="tel" value={contactInfo.phone} onChange={handleContactChange} className="input" dir="ltr" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="label flex items-center gap-2"><MapPin size={16} /> العنوان</label>
                        <input name="address" value={contactInfo.address} onChange={handleContactChange} className="input" />
                    </div>

                    <div className="md:col-span-2 border-t dark:border-gray-700 pt-4 mt-2">
                        <h3 className="font-semibold mb-4 text-sm text-gray-500 uppercase tracking-wider">روابط التواصل الاجتماعي</h3>
                    </div>

                    <div>
                        <label className="label flex items-center gap-2"><Twitter size={16} /> Twitter / X</label>
                        <input name="twitter" value={contactInfo.twitter} onChange={handleContactChange} className="input" dir="ltr" placeholder="https://twitter.com/..." />
                    </div>
                    <div>
                        <label className="label flex items-center gap-2"><Instagram size={16} /> Instagram</label>
                        <input name="instagram" value={contactInfo.instagram} onChange={handleContactChange} className="input" dir="ltr" placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                        <label className="label flex items-center gap-2"><Linkedin size={16} /> LinkedIn</label>
                        <input name="linkedin" value={contactInfo.linkedin} onChange={handleContactChange} className="input" dir="ltr" placeholder="https://linkedin.com/..." />
                    </div>
                    <div>
                        <label className="label flex items-center gap-2"><Youtube size={16} /> YouTube</label>
                        <input name="youtube" value={contactInfo.youtube} onChange={handleContactChange} className="input" dir="ltr" placeholder="https://youtube.com/..." />
                    </div>
                </div>
            </div>
        </div>
    )
}


'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, Trophy, Mail, Phone, MapPin, Globe, Instagram, Twitter, Linkedin, Youtube, CheckCircle, AlertCircle } from 'lucide-react'

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
            <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-gray-500">جاري تحميل الإعدادات...</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">إعدادات الموقع</h1>
                        <p className="text-indigo-100">قم بتخصيص معلومات الموقع والتواصل</p>
                    </div>
                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${saving
                                ? 'bg-gray-400 cursor-not-allowed'
                                : saveStatus === 'success'
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : saveStatus === 'error'
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
                            }`}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
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
            </div>

            {/* Smart Learner Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6">
                    <div className="flex items-center gap-3 text-white">
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <Trophy size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">المتعلم الذكي</h2>
                            <p className="text-yellow-50">لقب العام - يظهر في الصفحة الرئيسية</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">اسم الطالب</label>
                            <input
                                name="name"
                                value={smartLearner.name}
                                onChange={handleSmartLearnerChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                placeholder="أدخل اسم الطالب"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">اللقب / المسمى</label>
                            <input
                                name="title"
                                value={smartLearner.title}
                                onChange={handleSmartLearnerChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                placeholder="مثال: متعلم متميز"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">الدفعة / السنة</label>
                            <input
                                name="cohort"
                                value={smartLearner.cohort}
                                onChange={handleSmartLearnerChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                placeholder="مثال: دفعة 2025"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">الوصف / نص التكريم</label>
                            <textarea
                                name="description"
                                value={smartLearner.description}
                                onChange={handleSmartLearnerChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition resize-none"
                                placeholder="اكتب نص التكريم هنا..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                    <div className="flex items-center gap-3 text-white">
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <Globe size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">معلومات التواصل</h2>
                            <p className="text-blue-50">تظهر في تذييل الموقع</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Basic Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                            معلومات الاتصال الأساسية
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Mail size={16} className="text-blue-500" />
                                    البريد الإلكتروني
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    value={contactInfo.email}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                    dir="ltr"
                                    placeholder="info@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Phone size={16} className="text-blue-500" />
                                    رقم الهاتف
                                </label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={contactInfo.phone}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                    dir="ltr"
                                    placeholder="+966 XX XXX XXXX"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500" />
                                    العنوان
                                </label>
                                <input
                                    name="address"
                                    value={contactInfo.address}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                    placeholder="أدخل العنوان الكامل"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                            روابط التواصل الاجتماعي
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Twitter size={16} className="text-sky-500" />
                                    Twitter / X
                                </label>
                                <input
                                    name="twitter"
                                    value={contactInfo.twitter}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                    dir="ltr"
                                    placeholder="https://twitter.com/username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Instagram size={16} className="text-pink-500" />
                                    Instagram
                                </label>
                                <input
                                    name="instagram"
                                    value={contactInfo.instagram}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                    dir="ltr"
                                    placeholder="https://instagram.com/username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Linkedin size={16} className="text-blue-600" />
                                    LinkedIn
                                </label>
                                <input
                                    name="linkedin"
                                    value={contactInfo.linkedin}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                    dir="ltr"
                                    placeholder="https://linkedin.com/company/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Youtube size={16} className="text-red-600" />
                                    YouTube
                                </label>
                                <input
                                    name="youtube"
                                    value={contactInfo.youtube}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                                    dir="ltr"
                                    placeholder="https://youtube.com/@channel"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

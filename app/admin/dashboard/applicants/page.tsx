'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { BookOpen, User, Phone, Mail, Calendar, Download } from 'lucide-react'

export default function ApplicantsPage() {
    const supabase = createClient()
    const [courses, setCourses] = useState<any[]>([])
    const [selectedCourseId, setSelectedCourseId] = useState<string>('')
    const [applicants, setApplicants] = useState<any[]>([])
    const [loadingCourses, setLoadingCourses] = useState(true)
    const [loadingApplicants, setLoadingApplicants] = useState(false)

    useEffect(() => {
        loadCourses()
    }, [])

    useEffect(() => {
        if (selectedCourseId) {
            loadApplicants(selectedCourseId)
        } else {
            setApplicants([])
        }
    }, [selectedCourseId])

    const loadCourses = async () => {
        const { data } = await supabase
            .from('courses')
            .select('id, title')
            .order('created_at', { ascending: false })
        setCourses(data || [])
        setLoadingCourses(false)
    }

    const loadApplicants = async (courseId: string) => {
        setLoadingApplicants(true)
        const { data } = await supabase
            .from('applicants')
            .select('*')
            .eq('course_id', courseId)
            .order('created_at', { ascending: false })
        setApplicants(data || [])
        setLoadingApplicants(false)
    }

    if (loadingCourses) return <div className="loading" style={{ margin: '2rem auto' }}></div>

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>عرض المسجلين في الدورات</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    اختر الدورة لعرض قائمة المسجلين وتصدير بياناتهم
                </p>
            </div>

            {/* Course Selector */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)', background: 'var(--grad-navy)', color: 'white' }}>
                <div className="form-group" style={{ maxWidth: '500px', margin: '0' }}>
                    <label className="label" style={{ color: 'white', opacity: 0.9 }}>اختر الدورة التدريبية</label>
                    <select
                        className="input"
                        style={{ background: 'rgba(255,255,255,1)', color: 'var(--color-navy)' }}
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                    >
                        <option value="">-- اضغط للاختيار من القائمة --</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedCourseId ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                            قائمة المسجلين ({applicants.length})
                        </h2>
                        {applicants.length > 0 && (
                            <a
                                href={`/api/export/applicants?courseId=${selectedCourseId}`}
                                className="btn btn-secondary btn-sm"
                                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                                download
                            >
                                <Download size={16} /> تصدير للقائمة (Excel)
                            </a>
                        )}
                    </div>

                    {loadingApplicants ? (
                        <div className="loading" style={{ margin: '2rem auto' }}></div>
                    ) : applicants.length > 0 ? (
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div className="table-container">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '2px solid var(--color-border)' }}>
                                            <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>الاسم الكامل</th>
                                            <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>رقم الجوال</th>
                                            <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>البريد الإلكتروني</th>
                                            <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>تاريخ التسجيل</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicants.map((applicant) => (
                                            <tr key={applicant.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <td style={{ padding: 'var(--spacing-md)', fontWeight: 500 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <User size={16} style={{ color: 'var(--color-text-muted)' }} />
                                                        {applicant.full_name}
                                                    </div>
                                                </td>
                                                <td style={{ padding: 'var(--spacing-md)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Phone size={16} style={{ color: 'var(--color-text-muted)' }} />
                                                        <span dir="ltr">{applicant.phone}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: 'var(--spacing-md)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Mail size={16} style={{ color: 'var(--color-text-muted)' }} />
                                                        {applicant.email}
                                                    </div>
                                                </td>
                                                <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Calendar size={16} style={{ color: 'var(--color-text-muted)' }} />
                                                        {new Date(applicant.registration_date).toLocaleDateString('ar-SA')}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
                            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>لا يوجد مسجلين في هذه الدورة حتى الآن</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
                    <BookOpen size={48} style={{ color: 'var(--color-border)', marginBottom: 'var(--spacing-md)' }} />
                    <h3 style={{ color: 'var(--color-text-muted)' }}>يرجى اختيار دورة من القائمة أعلاه لعرض المسجلين</h3>
                </div>
            )}
        </div>
    )
}

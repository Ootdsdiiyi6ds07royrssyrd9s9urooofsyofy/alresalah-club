import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Mail, Phone, Calendar, User, Book, Heart, ArrowRight, Shield, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !student) {
        notFound();
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <Link href="/admin/dashboard/students" className="btn btn-secondary p-2">
                        <ArrowRight size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>تفاصيل الطالب</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>عرض الملف الشخصي الكامل والبيانات التعليمية</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <span className="badge badge-success">نشط</span>
                    {student.bawaba_id && <span className="badge badge-primary">بوابة</span>}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-xl)' }}>
                {/* Profile Card */}
                <div className="card-elevated" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        {student.avatar_url ? (
                            <img
                                src={student.avatar_url}
                                alt={student.name}
                                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto', border: '4px solid var(--color-surface)' }}
                            />
                        ) : (
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'var(--grad-navy)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                margin: '0 auto',
                                fontSize: '3rem'
                            }}>
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>{student.name}</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>{student.specialization || 'لم يحدد التخصص بعد'}</p>

                    <div style={{ textAlign: 'right', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                            <Mail size={16} className="text-text-muted" />
                            <span>{student.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                            <Phone size={16} className="text-text-muted" />
                            <span dir="ltr">{student.phone || 'غير مسجل'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                            <Shield size={16} className="text-text-muted" />
                            <span>رقم الهوية: {student.national_id || 'غير مسجل'}</span>
                        </div>
                    </div>
                </div>

                {/* Details Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {/* Bio & Interests */}
                    <div className="card">
                        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <FileText size={20} className="text-primary" /> النبذة الشخصية
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', marginBottom: 'var(--spacing-lg)' }}>
                            {student.bio || 'لا توجد نبذة تعريفية متاحة لهذا الطالب.'}
                        </p>

                        <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'bold', marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <Heart size={18} className="text-accent" /> الاهتمامات
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                            {student.interests && student.interests.length > 0 ? (
                                student.interests.map((interest: string, index: number) => (
                                    <span key={index} className="badge badge-secondary" style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}>
                                        {interest}
                                    </span>
                                ))
                            ) : (
                                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>لم يتم تحديد اهتمامات</span>
                            )}
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                        <div>
                            <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                <Calendar size={14} /> تاريخ الانضمام
                            </h4>
                            <p style={{ fontWeight: '600' }}>{new Date(student.created_at).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                <Clock size={14} /> آخر ظهور
                            </h4>
                            <p style={{ fontWeight: '600' }}>
                                {student.last_login ? new Date(student.last_login).toLocaleString('ar-SA') : 'لم يسجل دخول بعد'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, Book, Heart, Calendar, FileText, Save, Loader2, Camera, ArrowRight, CheckCircle } from 'lucide-react';

export default function StudentProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [student, setStudent] = useState<any>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/student/profile');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'فشل تحميل البيانات');
            setStudent(data.student);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Handle interests as array
        const interests = (data.interests as string).split(',').map(i => i.trim()).filter(i => i !== '');

        try {
            const response = await fetch('/api/student/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, interests }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'فشل التحديث');

            setSuccess('تم تحديث الملف الشخصي بنجاح');
            setStudent(result.student);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
                <div className="loading" style={{ width: '40px', height: '40px' }}></div>
                <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>جاري تحميل ملفك الشخصي...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-xl) 0', background: 'var(--color-background)' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <Link href="/student/dashboard" className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
                            <ArrowRight size={20} />
                        </Link>
                        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800' }} className="gradient-text">الملف الشخصي</h1>
                    </div>
                </div>

                {success && (
                    <div className="alert alert-success fade-in" style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} /> {success}
                    </div>
                )}
                {error && (
                    <div className="alert alert-error fade-in" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        {error}
                    </div>
                )}

                <div className="flex-responsive" style={{ alignItems: 'flex-start' }}>
                    {/* Sidebar */}
                    <div style={{ flex: '1 1 300px' }}>
                        <div className="card-elevated text-center" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto var(--spacing-lg)' }}>
                                {student?.avatar_url ? (
                                    <img src={student.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '32px', objectFit: 'cover', border: '4px solid white', boxShadow: 'var(--shadow-md)' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', borderRadius: '32px', background: 'var(--grad-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy)', fontSize: '2.5rem', fontWeight: '800', border: '4px solid white', boxShadow: 'var(--shadow-md)' }}>
                                        {student?.name?.[0] || 'S'}
                                    </div>
                                )}
                                <button style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }} title="تغيير الصورة">
                                    <Camera size={18} />
                                </button>
                            </div>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>{student?.name}</h2>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>{student?.specialization || 'طالب في النادي'}</p>

                            <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)', textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                    <Mail size={16} /> {student?.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                    <Phone size={16} /> <span dir="ltr">{student?.phone || 'غير مسجل'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={18} className="text-primary" /> إحصائياتي
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>نسبة الإنجاز</span>
                                <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>100%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>الشهادات</span>
                                <span style={{ fontWeight: '700' }}>0</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Settings */}
                    <div style={{ flex: '2 1 600px' }}>
                        <div className="card-elevated" style={{ padding: 'var(--spacing-2xl)' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: 'var(--spacing-lg)', paddingBottom: '10px', borderBottom: '2px solid var(--color-accent)', display: 'inline-block' }}>المعلومات الأساسية</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
                                        <div className="form-group">
                                            <label className="label">الاسم الكامل</label>
                                            <div style={{ position: 'relative' }}>
                                                <User style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                                                <input name="name" defaultValue={student?.name} className="input" style={{ paddingRight: '40px' }} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="label">التخصص / المجال</label>
                                            <div style={{ position: 'relative' }}>
                                                <Book style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                                                <input name="specialization" defaultValue={student?.specialization} className="input" style={{ paddingRight: '40px' }} placeholder="مثال: هندسة برمجيات" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="label">تاريخ الميلاد</label>
                                            <div style={{ position: 'relative' }}>
                                                <Calendar style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                                                <input name="birth_date" type="date" defaultValue={student?.birth_date} className="input" style={{ paddingRight: '40px' }} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="label">رقم الهوية (للعرض فقط)</label>
                                            <input name="national_id" defaultValue={student?.national_id} className="input" readOnly style={{ background: 'var(--color-surface)', opacity: 0.6, cursor: 'not-allowed' }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: 'var(--spacing-lg)', paddingBottom: '10px', borderBottom: '2px solid var(--color-accent)', display: 'inline-block' }}>النبذة والاهتمامات</h3>
                                    <div className="form-group">
                                        <label className="label">عن نفسي</label>
                                        <textarea name="bio" defaultValue={student?.bio} rows={4} className="input" placeholder="اكتب نبذة مختصرة عن خلفيتك التعليمية وأهدافك..." />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">الاهتمامات (افصل بينها بفاصلة)</label>
                                        <div style={{ position: 'relative' }}>
                                            <Heart style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                                            <input name="interests" defaultValue={student?.interests?.join(', ')} className="input" style={{ paddingRight: '40px' }} placeholder="مثال: ذكاء اصطناعي، أمن سيبراني، تصميم تجربة المستخدم" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--spacing-xl)', borderTop: '1px solid var(--color-border)' }}>
                                    <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '16px' }}>
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Save size={18} /> حفظ التغييرات
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


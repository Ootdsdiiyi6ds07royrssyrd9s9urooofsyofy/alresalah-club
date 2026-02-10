'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, IdCard, ArrowRight, CheckCircle } from 'lucide-react';

export default function StudentRegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/student/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'فشل التسجيل');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/student/login');
            }, 2500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--grad-gold)',
                padding: 'var(--spacing-md)'
            }}>
                <div className="card-elevated text-center p-8 max-w-md w-full fade-in" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--color-success)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-lg)',
                        boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
                    }}>
                        <CheckCircle size={40} />
                    </div>
                    <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>تم التسجيل بنجاح!</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>جاري توجيهك لصفحة تسجيل الدخول...</p>
                    <div className="loading"></div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--grad-gold)',
            padding: 'var(--spacing-2xl) var(--spacing-md)'
        }}>
            <div className="card-elevated fade-in" style={{
                maxWidth: '600px',
                width: '100%',
                padding: 'var(--spacing-2xl)',
                backgroundColor: 'var(--color-surface-elevated)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h1 className="gradient-text" style={{
                        fontSize: 'var(--font-size-3xl)',
                        fontWeight: '800',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        إنشاء حساب جديد
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>انضم لنادي الرسالة التعليمي</p>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label" htmlFor="name">الاسم الكامل</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                            <input id="name" name="name" type="text" required className="input" style={{ paddingRight: '40px' }} placeholder="الاسم كما في الهوية" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="email">البريد الإلكتروني</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                            <input id="email" name="email" type="email" required className="input" style={{ paddingRight: '40px' }} placeholder="example@mail.com" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label className="label" htmlFor="phone">رقم الجوال</label>
                            <div style={{ position: 'relative' }}>
                                <Phone style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                                <input id="phone" name="phone" type="tel" className="input" style={{ paddingRight: '40px' }} placeholder="05xxxxxxxx" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="label" htmlFor="national_id">الهوية الوطنية</label>
                            <div style={{ position: 'relative' }}>
                                <IdCard style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                                <input id="national_id" name="national_id" type="text" className="input" style={{ paddingRight: '40px' }} placeholder="1xxxxxxxxx" />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label className="label" htmlFor="password">كلمة المرور</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                                <input id="password" name="password" type="password" required className="input" style={{ paddingRight: '40px' }} placeholder="••••••••" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="label" htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                                <input id="confirmPassword" name="confirmPassword" type="password" required className="input" style={{ paddingRight: '40px' }} placeholder="••••••••" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: 'var(--spacing-md)' }}>
                        {loading ? <span className="loading"></span> : 'إنشاء الحساب'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-lg)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            لديك حساب بالفعل؟{' '}
                            <Link href="/student/login" style={{ fontWeight: '600', color: 'var(--color-accent)', textDecoration: 'none' }}>
                                سجل دخولك هنا
                            </Link>
                        </p>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
                    <Link href="/login/portal" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-muted)',
                        textDecoration: 'none'
                    }} className="hover:text-primary">
                        <ArrowRight size={14} /> العودة لاختيار البوابة
                    </Link>
                </div>
            </div>
        </div>
    );
}


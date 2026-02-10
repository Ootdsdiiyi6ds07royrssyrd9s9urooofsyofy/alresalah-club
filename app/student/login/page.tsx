'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, LogIn, UserPlus } from 'lucide-react';

export default function StudentLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await fetch('/api/student/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'فشل تسجيل الدخول');
            }

            // Successful login
            window.location.href = '/student/dashboard';

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--grad-gold)',
            padding: 'var(--spacing-md)'
        }}>
            <div className="card-elevated fade-in" style={{
                maxWidth: '450px',
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
                        نادي الرسالة
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>بوابة الطلاب</p>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label className="label" htmlFor="email">البريد الإلكتروني</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="input"
                                style={{ paddingRight: '40px' }}
                                placeholder="example@mail.com"
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <label className="label" htmlFor="password">كلمة المرور</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-muted)' }} size={18} />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="input"
                                style={{ paddingRight: '40px' }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                        {loading ? <span className="loading"></span> : (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
                                <LogIn size={20} /> تسجيل الدخول
                            </span>
                        )}
                    </button>
                </form>

                <div style={{ margin: 'var(--spacing-xl) 0' }}>
                    <div style={{ position: 'relative', textAlign: 'center' }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--color-border)' }}></div>
                        <span style={{ position: 'relative', padding: '0 12px', background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>أو</span>
                    </div>

                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <Link
                            href="/api/auth/bawaba/login"
                            className="btn btn-secondary"
                            style={{
                                width: '100%',
                                padding: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <img src="/bawaba-logo.png" alt="" style={{ width: '20px', height: '20px' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                            الدخول عبر نفاذ / بوابة
                        </Link>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-lg)' }}>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        ليس لديك حساب؟{' '}
                        <Link href="/student/register" style={{ fontWeight: '600', color: 'var(--color-accent)', textDecoration: 'none' }}>
                            أنشئ حساباً جديداً
                        </Link>
                    </p>
                </div>

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


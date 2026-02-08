'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft, LogIn } from 'lucide-react';

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

            router.push('/student/dashboard');
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-background)' }}>
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold gradient-text">تسجيل دخول الطلاب</h2>
                    <p className="mt-2 text-sm text-text-secondary">مرحباً بك مجدداً في نادي الرسالة</p>
                </div>

                <div className="card-elevated p-8">
                    {error && (
                        <div className="alert alert-error mb-6">
                            {error}
                        </div>
                    )}

                    {/* Direct Login Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="label" htmlFor="email">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-3 text-text-muted" size={18} />
                                <input id="email" name="email" type="email" required className="input pr-10" placeholder="example@mail.com" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="password">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 text-text-muted" size={18} />
                                <input id="password" name="password" type="password" required className="input pr-10" placeholder="••••••••" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                            {loading ? <span className="loading"></span> : (
                                <span className="flex items-center gap-2">
                                    <LogIn size={18} /> تسجيل الدخول
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-surface-elevated text-text-muted">أو</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/api/auth/bawaba/login"
                                className="btn btn-secondary w-full py-3 flex items-center justify-center gap-2"
                            >
                                <img src="/bawaba-logo.png" alt="" className="w-5 h-5 opacity-70" onError={(e) => e.currentTarget.style.display = 'none'} />
                                تسجيل الدخول عبر بوابة
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-sm text-text-secondary">
                            ليس لديك حساب؟{' '}
                            <Link href="/student/register" className="font-medium text-primary hover:underline">
                                أنشئ حساباً جديداً
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
                        <ArrowLeft size={16} /> العودة للرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}

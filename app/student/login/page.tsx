'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, AlertCircle, Clock, CheckCircle } from 'lucide-react';

export default function StudentLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [authStatus, setAuthStatus] = useState<null | 'pending' | 'unverified'>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setAuthStatus(null);

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
                if (result.code === 'PENDING_APPROVAL') {
                    setAuthStatus('pending');
                    return;
                }
                if (result.code === 'UNVERIFIED') {
                    setAuthStatus('unverified');
                    // Optionally redirect to verify page with email
                    // router.push(`/student/verify?email=${encodeURIComponent(email)}`);
                    return;
                }
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

    if (authStatus === 'pending') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--grad-gold)]">
                <div className="bg-[var(--color-surface-elevated)] p-8 rounded-2xl shadow-xl max-w-md w-full text-center fade-in border border-[var(--color-border)]">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
                        <Clock size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-[var(--color-text)]">الحساب قيد المراجعة</h2>
                    <p className="text-[var(--color-text-secondary)] mb-8">
                        شكراً لتسجيلك! حسابك حالياً في انتظار موافقة المسؤول. سيتم تفعيل حسابك قريباً.
                    </p>
                    <button
                        onClick={() => setAuthStatus(null)}
                        className="btn btn-secondary w-full"
                    >
                        العودة لتسجيل الدخول
                    </button>
                </div>
            </div>
        );
    }

    if (authStatus === 'unverified') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--grad-gold)]">
                <div className="bg-[var(--color-surface-elevated)] p-8 rounded-2xl shadow-xl max-w-md w-full text-center fade-in border border-[var(--color-border)]">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-[var(--color-text)]">الحساب غير مفعل</h2>
                    <p className="text-[var(--color-text-secondary)] mb-8">
                        يرجى التحقق من بريدك الإلكتروني وتفعيل الحساب باستخدام رمز التحقق.
                    </p>
                    <button
                        onClick={() => setAuthStatus(null)}
                        className="btn btn-primary w-full"
                    >
                        العودة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--grad-gold)]">
            <div className="bg-[var(--color-surface-elevated)] p-8 rounded-2xl shadow-2xl max-w-md w-full fade-in relative overflow-hidden border border-[var(--color-border)]">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                        نادي الرسالة
                    </h1>
                    <p className="text-[var(--color-text-secondary)] font-medium">بوابة الطلاب</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm animate-shake border border-red-100">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="email">البريد الإلكتروني</label>
                        <div className="relative group">
                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" size={18} />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full h-12 pr-12 pl-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] transition-all outline-none"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="password">كلمة المرور</label>
                        <div className="relative group">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" size={18} />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full h-12 pr-12 pl-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="loading w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : (
                            <>
                                <LogIn size={20} /> تسجيل الدخول
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        ليس لديك حساب؟{' '}
                        <Link href="/student/register" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
                            أنشئ حساباً جديداً
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, IdCard, ArrowRight, CheckCircle, KeyRound } from 'lucide-react';

export default function StudentRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<'register' | 'verify' | 'success'>('register');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    // Registration Form Data
    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const registerEmail = data.email as string;

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

            setEmail(registerEmail);
            setStep('verify');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Verification Form Data
    const handleVerifySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const code = formData.get('code') as string;

        try {
            const response = await fetch('/api/student/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'فشل التحقق');
            }

            setStep('success');
            setTimeout(() => {
                router.push('/student/login');
            }, 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--grad-gold)]">
                <div className="bg-[var(--color-surface-elevated)] p-8 rounded-2xl shadow-xl max-w-md w-full text-center fade-in border border-[var(--color-border)]">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-lg shadow-green-100/50">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-[var(--color-text)]">تم التسجيل بنجاح!</h2>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        تم تقديم طلبك بنجاح وهو الآن قيد المراجعة من قبل الإدارة. سيتم إشعارك عند التفعيل.
                    </p>
                    <div className="text-sm text-[var(--color-text-muted)]">جاري التوجيه لصفحة الدخول...</div>
                </div>
            </div>
        );
    }

    if (step === 'verify') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--grad-gold)]">
                <div className="bg-[var(--color-surface-elevated)] p-8 rounded-2xl shadow-xl max-w-md w-full fade-in border border-[var(--color-border)]">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[var(--color-primary-alpha)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-primary)]">
                            <KeyRound size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-text)]">التحقق من الحساب</h2>
                        <p className="text-[var(--color-text-secondary)] text-sm mt-2">
                            تم إرسال رمز التحقق إلى بريدك الإلكتروني <br />
                            <span className="font-semibold text-[var(--color-text)]">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerifySubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="code">رمز التحقق</label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                maxLength={6}
                                className="w-full h-14 text-center text-2xl tracking-widest rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] transition-all outline-none"
                                placeholder="------"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="loading w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'تفعيل الحساب'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setStep('register')}
                            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            تغيير البريد الإلكتروني
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--grad-gold)]">
            <div className="bg-[var(--color-surface-elevated)] p-8 rounded-2xl shadow-xl max-w-2xl w-full fade-in border border-[var(--color-border)]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                        إنشاء حساب جديد
                    </h1>
                    <p className="text-[var(--color-text-secondary)] font-medium">انضم لنادي الرسالة التعليمي</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleRegisterSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="name">الاسم الكامل</label>
                            <div className="relative group">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" size={18} />
                                <input id="name" name="name" type="text" required className="input-field w-full" style={{ paddingRight: '2.5rem' }} placeholder="الاسم كما في الهوية" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="national_id">الهوية الوطنية</label>
                            <div className="relative group">
                                <IdCard className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" size={18} />
                                <input id="national_id" name="national_id" type="text" className="input-field w-full" style={{ paddingRight: '2.5rem' }} placeholder="1xxxxxxxxx" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="email">البريد الإلكتروني</label>
                            <div className="relative group">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" size={18} />
                                <input id="email" name="email" type="email" required className="input-field w-full" style={{ paddingRight: '2.5rem' }} placeholder="example@mail.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="phone">رقم الجوال</label>
                            <div className="relative group">
                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" size={18} />
                                <input id="phone" name="phone" type="tel" className="input-field w-full" style={{ paddingRight: '2.5rem' }} placeholder="05xxxxxxxx" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="password">كلمة المرور</label>
                            <div className="relative group">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" size={18} />
                                <input id="password" name="password" type="password" required className="input-field w-full" style={{ paddingRight: '2.5rem' }} placeholder="••••••••" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                            <div className="relative group">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" size={18} />
                                <input id="confirmPassword" name="confirmPassword" type="password" required className="input-field w-full" style={{ paddingRight: '2.5rem' }} placeholder="••••••••" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? <span className="loading w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'إرسال رمز التحقق'}
                    </button>

                    <div className="text-center pt-6 border-t border-[var(--color-border)]">
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            لديك حساب بالفعل؟{' '}
                            <Link href="/student/login" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
                                سجل دخولك هنا
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .input-field {
                    height: 3rem;
                    padding-left: 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--color-border);
                    background-color: var(--color-surface);
                    color: var(--color-text);
                    transition: all 0.2s;
                    outline: none;
                }
                .input-field:focus {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 2px var(--color-primary-alpha);
                }
            `}</style>
        </div>
    );
}

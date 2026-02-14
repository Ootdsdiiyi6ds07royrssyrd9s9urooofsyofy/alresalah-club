'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, IdCard, ArrowRight, CheckCircle, KeyRound, Loader2, AlertCircle } from 'lucide-react';

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
            <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--grad-gold)]" dir="rtl">
                <div className="bg-[var(--color-surface-elevated)] p-10 rounded-3xl shadow-2xl max-w-md w-full text-center fade-in border border-[var(--color-border)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-success)] to-[var(--color-primary)]"></div>

                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 shadow-inner">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black mb-4 text-[var(--color-text)]">تم التسجيل بنجاح!</h2>
                    <p className="text-[var(--color-text-secondary)] mb-8 text-lg leading-relaxed">
                        تم تقديم طلبك بنجاح وهو الآن قيد المراجعة من قبل الإدارة. سيتم إشعارك عند تفعيل الحساب.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)] animate-pulse">
                        <Loader2 className="animate-spin" size={16} />
                        جاري التوجيه لصفحة الدخول...
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'verify') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--grad-gold)]" dir="rtl">
                <div className="bg-[var(--color-surface-elevated)] p-10 rounded-3xl shadow-2xl max-w-md w-full fade-in border border-[var(--color-border)] relative">
                    <button
                        onClick={() => setStep('register')}
                        className="absolute top-6 right-6 text-gray-400 hover:text-[var(--color-primary)] transition"
                    >
                        <ArrowRight size={24} />
                    </button>

                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-[var(--color-primary-alpha)] rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)] shadow-lg">
                            <KeyRound size={40} className="-rotate-3" />
                        </div>
                        <h2 className="text-3xl font-black text-[var(--color-text)] mb-2">التحقق من الحساب</h2>
                        <p className="text-[var(--color-text-secondary)]">
                            أدخل رمز التحقق المرسل إلى: <br />
                            <span className="font-bold text-[var(--color-text)] dir-ltr block mt-1">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-center justify-center gap-2 text-sm font-medium animate-shake">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerifySubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-[var(--color-text-secondary)] block text-center" htmlFor="code">رمز التحقق (OTP)</label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                maxLength={6}
                                autoFocus
                                className="w-full h-16 text-center text-3xl font-mono tracking-[0.5em] rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-alpha)] transition-all outline-none placeholder:tracking-widest"
                                placeholder="------"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[var(--color-primary)] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'تفعيل الحساب'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-[var(--color-text-muted)]">
                            لم يصلك الرمز؟{' '}
                            <button className="font-bold text-[var(--color-primary)] hover:underline">إعادة الإرسال</button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[var(--color-background)]" dir="rtl">
            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="absolute top-6 right-6">
                    <Link href="/" className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition font-medium">
                        <ArrowRight size={20} />
                        العودة للرئيسية
                    </Link>
                </div>

                <div className="max-w-md w-full fade-in">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-[var(--color-navy)] mb-3 dark:text-[var(--color-gold)]">
                            إنشاء حساب جديد
                        </h1>
                        <p className="text-[var(--color-text-secondary)] text-lg">انضم لنخبة نادي الرسالة واستفد من خدماتنا</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3 text-sm font-medium border border-red-100">
                            <AlertCircle size={20} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--color-text)] mr-1">الاسم الكامل</label>
                            <div className="relative group">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full h-12 pr-12 pl-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all placeholder:text-gray-300"
                                    placeholder="الاسم الثلاثي كما في الهوية"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--color-text)] mr-1">رقم الهوية</label>
                            <div className="relative group">
                                <IdCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                                <input
                                    name="national_id"
                                    type="text"
                                    className="w-full h-12 pr-12 pl-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all placeholder:text-gray-300"
                                    placeholder="رقم الهوية الوطنية / الإقامة"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-text)] mr-1">رقم الجوال</label>
                                <div className="relative group">
                                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                                    <input
                                        name="phone"
                                        type="tel"
                                        dir="ltr"
                                        className="w-full h-12 pr-12 pl-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all placeholder:text-gray-300 text-right"
                                        placeholder="05xxxxxxxx"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-text)] mr-1">البريد الإلكتروني</label>
                                <div className="relative group">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        dir="ltr"
                                        className="w-full h-12 pr-12 pl-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all placeholder:text-gray-300 text-right"
                                        placeholder="example@mail.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-text)] mr-1">كلمة المرور</label>
                                <div className="relative group">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        dir="ltr"
                                        className="w-full h-12 pr-12 pl-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all placeholder:text-gray-300 text-right"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-text)] mr-1">تأكيد كلمة المرور</label>
                                <div className="relative group">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        dir="ltr"
                                        className="w-full h-12 pr-12 pl-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all placeholder:text-gray-300 text-right"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[var(--color-secondary)] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2 mt-8"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'إنشاء الحساب الجديد'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[var(--color-text-secondary)]">
                            لديك حساب بالفعل؟{' '}
                            <Link href="/student/login" className="font-bold text-[var(--color-primary)] hover:underline">
                                تسجيل الدخول
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Left Side - Image/Decoration (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-[var(--grad-gold)] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/patterns/islamic-pattern.png')] opacity-10"></div>
                <div className="relative z-10 text-center max-w-lg">
                    <div className="mb-8 inline-block p-6 bg-white/20 backdrop-blur-md rounded-full shadow-2xl border border-white/30">
                        <img src="/logo.png" alt="شعار النادي" className="w-32 h-32 object-contain drop-shadow-md" />
                    </div>
                    <h2 className="text-4xl font-black text-[var(--color-navy)] mb-6 leading-tight">
                        رحلتك نحو التميز تبدأ من هنا
                    </h2>
                    <p className="text-[var(--color-navy)] text-xl opacity-90 leading-relaxed font-medium">
                        انضم إلى مجتمع نادي الرسالة، حيث نصنع القادة ونبني المستقبل من خلال برامج تعليمية وتربوية متميزة.
                    </p>

                    <div className="mt-12 flex justify-center gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-2 text-[var(--color-navy)]">
                                <User size={24} />
                            </div>
                            <span className="text-sm font-bold text-[var(--color-navy)]">مجتمع تفاعلي</span>
                        </div>
                        <div className="w-px h-16 bg-[var(--color-navy)]/20 mx-4"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-2 text-[var(--color-navy)]">
                                <CheckCircle size={24} />
                            </div>
                            <span className="text-sm font-bold text-[var(--color-navy)]">شهادات معتمدة</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

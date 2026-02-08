'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, IdCard, ArrowLeft } from 'lucide-react';

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
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="card text-center p-8 max-w-md w-full fade-in">
                    <div className="w-20 h-20 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">تم التسجيل بنجاح!</h2>
                    <p className="text-text-secondary mb-6">جاري توجيهك لصفحة تسجيل الدخول...</p>
                    <div className="loading mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-beige)' }}>
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold gradient-text">إنشاء حساب طالب جديد</h2>
                    <p className="mt-2 text-sm text-text-secondary">انضم إلى نادي الرسالة التعليمي</p>
                </div>

                <div className="card-elevated p-8">
                    {error && (
                        <div className="alert alert-error mb-6 flex items-center gap-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="label" htmlFor="name">الاسم الكامل</label>
                            <div className="relative">
                                <User className="absolute right-3 top-3 text-text-muted" size={18} />
                                <input id="name" name="name" type="text" required className="input pr-10" placeholder="الاسم كما في الهوية" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="email">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-3 text-text-muted" size={18} />
                                <input id="email" name="email" type="email" required className="input pr-10" placeholder="example@mail.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="label" htmlFor="phone">رقم الجوال</label>
                                <div className="relative">
                                    <Phone className="absolute right-3 top-3 text-text-muted" size={18} />
                                    <input id="phone" name="phone" type="tel" className="input pr-10" placeholder="05xxxxxxxx" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="national_id">الهوية الوطنية</label>
                                <div className="relative">
                                    <IdCard className="absolute right-3 top-3 text-text-muted" size={18} />
                                    <input id="national_id" name="national_id" type="text" className="input pr-10" placeholder="1xxxxxxxxx" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="password">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 text-text-muted" size={18} />
                                <input id="password" name="password" type="password" required className="input pr-10" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 text-text-muted" size={18} />
                                <input id="confirmPassword" name="confirmPassword" type="password" required className="input pr-10" placeholder="••••••••" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-lg">
                            {loading ? <span className="loading"></span> : 'إنشاء الحساب'}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-sm text-text-secondary">
                                لديك حساب بالفعل؟{' '}
                                <Link href="/student/login" className="font-medium text-primary hover:underline">
                                    سجل دخولك هنا
                                </Link>
                            </p>
                        </div>
                    </form>
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

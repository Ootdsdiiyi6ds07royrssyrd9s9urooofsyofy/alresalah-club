'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Book, Heart, Calendar, FileText, Save, Loader2, Camera } from 'lucide-react';

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
            <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
                <div className="loading" style={{ width: '40px', height: '40px' }}></div>
                <p className="mt-4 text-text-secondary">جاري تحميل ملفك الشخصي...</p>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 className="text-3xl font-bold mb-8 gradient-text">الملف الشخصي للطالب</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Avatar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card text-center p-8">
                            <div className="relative inline-block mx-auto mb-4">
                                {student?.avatar_url ? (
                                    <img src={student.avatar_url} alt="" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-grad-navy flex items-center justify-center text-white text-4xl font-bold">
                                        {student?.name?.[0] || 'S'}
                                    </div>
                                )}
                                <button className="absolute bottom-0 right-0 p-2 bg-accent text-navy rounded-full shadow-md hover:scale-110 transition-transform">
                                    <Camera size={18} />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold">{student?.name}</h2>
                            <p className="text-sm text-text-secondary">{student?.specialization || 'طالب في النادي'}</p>

                            <div className="mt-6 pt-6 border-t border-border space-y-3 text-right">
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <Mail size={16} /> {student?.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <Phone size={16} /> <span dir="ltr">{student?.phone || 'غير مسجل'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Badges/Stats Card */}
                        <div className="card p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-primary" /> إحصائياتي
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-secondary">الدورات المسجلة</span>
                                    <span className="badge badge-primary">0</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-secondary">نسبة الحضور</span>
                                    <span className="font-bold text-success">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Form */}
                    <div className="lg:col-span-2">
                        <div className="card-elevated p-8">
                            {success && (
                                <div className="alert alert-success mb-6 flex items-center gap-2 fade-in">
                                    <Save size={18} /> {success}
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-error mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold mb-4 pb-2 border-b border-border">المعلومات الشخصية</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="label">الاسم الكامل</label>
                                            <div className="relative">
                                                <User className="absolute right-3 top-3 text-text-muted" size={18} />
                                                <input name="name" defaultValue={student?.name} className="input pr-10" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="label">التخصص</label>
                                            <div className="relative">
                                                <Book className="absolute right-3 top-3 text-text-muted" size={18} />
                                                <input name="specialization" defaultValue={student?.specialization} className="input pr-10" placeholder="مثال: هندسة برمجيات" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="label">تاريخ الميلاد</label>
                                            <div className="relative">
                                                <Calendar className="absolute right-3 top-3 text-text-muted" size={18} />
                                                <input name="birth_date" type="date" defaultValue={student?.birth_date} className="input pr-10" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="label">الهوية الوطنية</label>
                                            <input name="national_id" defaultValue={student?.national_id} className="input" readOnly style={{ background: 'var(--color-background)', opacity: 0.7 }} title="لا يمكن تعديل رقم الهوية" />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold mb-4 pb-2 border-b border-border">الاهتمامات والنبذة التعريفية</h3>
                                    <div className="space-y-6">
                                        <div className="form-group">
                                            <label className="label">نبذة عني</label>
                                            <textarea name="bio" defaultValue={student?.bio} rows={4} className="input" placeholder="اكتب شيئاً بسيطاً عن نفسك..." />
                                        </div>
                                        <div className="form-group">
                                            <label className="label">الاهتمامات (افصل بينها بفاصلة)</label>
                                            <div className="relative">
                                                <Heart className="absolute right-3 top-3 text-text-muted" size={18} />
                                                <input name="interests" defaultValue={student?.interests?.join(', ')} className="input pr-10" placeholder="مثال: البرمجة، الرسم، التصميم" />
                                            </div>
                                            <p className="text-[10px] text-text-muted mt-1">تساعدنا هذه المعلومات في اقتراح دورات تناسب اهتماماتك</p>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-6 border-t border-border flex justify-end">
                                    <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: '180px' }}>
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : (
                                            <span className="flex items-center gap-2">
                                                <Save size={18} /> حفظ التعديلات
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

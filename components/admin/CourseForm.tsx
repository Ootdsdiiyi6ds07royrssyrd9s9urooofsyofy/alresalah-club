
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Upload, Save, X, CheckCircle, AlertCircle, Loader2, Calendar, FileText, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

interface CourseFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function CourseForm({ initialData, isEdit = false }: CourseFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [banner, setBanner] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.banner_url || null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);

        // Validation and Parsing
        const totalSeats = parseInt(formData.get('total_seats') as string);
        const price = parseFloat(formData.get('price') as string);

        if (isNaN(totalSeats) || totalSeats < 0) {
            setError('يرجى إدخال عدد مقاعد صحيح');
            setLoading(false);
            return;
        }

        const data: any = {
            title: formData.get('title'),
            description: formData.get('description'),
            instructor: formData.get('instructor'),
            start_date: formData.get('start_date') || null,
            end_date: formData.get('end_date') || null,
            total_seats: totalSeats,
            price: isNaN(price) ? 0 : price,
            status: formData.get('status'),
            is_happening_now: formData.get('is_happening_now') === 'on',
            is_active: formData.get('is_active') === 'on',
        };

        if (!isEdit) {
            data.available_seats = data.total_seats;
        }

        try {
            if (banner) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', banner);
                uploadFormData.append('folder', 'courses');

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadRes.ok) {
                    const errorData = await uploadRes.json();
                    throw new Error(errorData.error || 'فشل رفع الصورة سحابياً');
                }

                const uploadData = await uploadRes.json();
                data.banner_url = uploadData.url;
            }

            let resultError;
            if (isEdit) {
                const { error } = await supabase.from('courses').update(data).eq('id', initialData.id);
                resultError = error;
            } else {
                const { error } = await supabase.from('courses').insert(data);
                resultError = error;
            }

            if (resultError) throw resultError;

            setSuccess(isEdit ? 'تم تحديث الدورة بنجاح' : 'تم نشر الدورة بنجاح');

            setTimeout(() => {
                router.push('/admin/dashboard/courses');
                router.refresh();
            }, 1500);

        } catch (err: any) {
            console.error('Error saving course:', err);
            setError(err.message || 'حدث خطأ غير متوقع أثناء الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in max-w-5xl mx-auto">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-2 border border-green-100">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Main Info */}
                <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-sm border border-[var(--color-border)]">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text)]">تفاصيل الدورة الأساسية</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">عنوان الدورة</label>
                            <input
                                name="title"
                                defaultValue={initialData?.title}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all"
                                placeholder="مثال: أساسيات التصميم الجرافيكي"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">المدرب / المحاضر</label>
                            <input
                                name="instructor"
                                defaultValue={initialData?.instructor}
                                className="w-full h-12 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all"
                                placeholder="اسم المدرب"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">وصف الدورة</label>
                            <textarea
                                name="description"
                                rows={4}
                                defaultValue={initialData?.description}
                                className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all resize-none"
                                placeholder="اكتب وصفاً جذاباً وشاملاً للدورة..."
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Media & Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Upload size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text)]">صورة الغلاف</h3>
                        </div>

                        <div className="space-y-4">
                            {bannerPreview ? (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-[var(--color-border)] group">
                                    <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBanner(null);
                                                setBannerPreview(null);
                                            }}
                                            className="btn bg-red-500 text-white hover:bg-red-600"
                                        >
                                            <X size={20} /> حذف الصورة
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-[var(--color-border)] rounded-xl cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-background)] transition-all group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">اضغط للرفع</span> أو اسحب الملف هنا</p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setBanner(file);
                                                setBannerPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <CheckCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text)]">حالة النشر</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--color-text-secondary)]">حالة التسجيل</label>
                                <select
                                    name="status"
                                    defaultValue={initialData?.status || 'upcoming'}
                                    className="w-full h-12 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all appearance-none"
                                >
                                    <option value="upcoming">⏳ قريباً (لم يبدأ)</option>
                                    <option value="active">🟢 متاح للتسجيل</option>
                                    <option value="completed">🔴 منتهي (مغلق)</option>
                                </select>
                            </div>

                            <div className="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            defaultChecked={initialData?.is_active !== false}
                                            className="peer sr-only"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                                    </div>
                                    <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition">عرض الدورة في الموقع</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_happening_now"
                                            defaultChecked={initialData?.is_happening_now}
                                            className="peer sr-only"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                                    </div>
                                    <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition">تفعيل نظام التحضير (تقام الآن)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Logistics */}
                <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-sm border border-[var(--color-border)]">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text)]">المواعيد والمقاعد</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">تاريخ البدء</label>
                            <input
                                type="date"
                                name="start_date"
                                defaultValue={initialData?.start_date}
                                className="w-full h-12 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">تاريخ الانتهاء</label>
                            <input
                                type="date"
                                name="end_date"
                                defaultValue={initialData?.end_date}
                                className="w-full h-12 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">المقاعد المتاحة</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="total_seats"
                                    defaultValue={initialData?.total_seats || 0}
                                    required
                                    min="0"
                                    className="w-full h-12 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all"
                                />
                                <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">السعر (ريال)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    defaultValue={initialData?.price || 0}
                                    min="0"
                                    className="w-full h-12 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-alpha)] outline-none transition-all"
                                />
                                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-6 border-t border-[var(--color-border)] flex justify-end gap-4 sticky bottom-0 bg-[var(--color-background)]/80 backdrop-blur-sm p-4 rounded-xl z-20">
                    <Link
                        href="/admin/dashboard/courses"
                        className="px-6 py-3 rounded-xl font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors"
                    >
                        إلغاء الأمر
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <Save size={20} />
                                {isEdit ? 'حفظ التعديلات' : 'نشر الدورة'}
                            </>
                        )}
                    </button>
                </div>
            </form>

            <style jsx>{`
                /* Custom scrollbar check if needed */
            `}</style>
        </div>
    );
}

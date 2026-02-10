
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Upload, Save, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
        <div className="fade-in">
            {error && (
                <div className="alert alert-error mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success mb-6 flex items-center gap-2">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-10">
                {/* Basic Info Section */}
                <section>
                    <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-accent inline-block">المعلومات الأساسية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="form-group">
                            <label className="label">عنوان الدورة</label>
                            <input
                                name="title"
                                defaultValue={initialData?.title}
                                required
                                className="input"
                                placeholder="مثال: أساسيات التصميم الجرافيكي"
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">المدرب / المحاضر</label>
                            <input
                                name="instructor"
                                defaultValue={initialData?.instructor}
                                className="input"
                                placeholder="اسم المدرب الرباعي"
                            />
                        </div>
                    </div>
                    <div className="form-group mt-4">
                        <label className="label">وصف الدورة</label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={initialData?.description}
                            className="input"
                            placeholder="اكتب تفاصيل الدورة، المحاور، والمستهدفين..."
                        />
                    </div>
                </section>

                {/* Display & Status Section */}
                <section className="bg-surface p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-bold mb-6">إعدادات العرض والحالة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="form-group">
                            <label className="label">صورة الغلاف (Banner)</label>
                            <div className="flex flex-col gap-4">
                                {bannerPreview && (
                                    <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-accent">
                                        <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBanner(null);
                                                setBannerPreview(null);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-error text-white rounded-full hover:scale-110 transition"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                <label className="btn btn-secondary w-full h-12 dashed-border cursor-pointer">
                                    <Upload size={18} />
                                    <span>{bannerPreview ? 'تغيير الصورة' : 'رفع صورة الغلاف'}</span>
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
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="label">حالة التسجيل</label>
                                <select name="status" defaultValue={initialData?.status || 'upcoming'} className="input">
                                    <option value="upcoming">قريباً (لم يبدأ التسجيل)</option>
                                    <option value="active">متاحة للتسجيل الآن</option>
                                    <option value="completed">منتهية (للأرشفة)</option>
                                </select>
                            </div>

                            <div className="space-y-4 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        defaultChecked={initialData?.is_active !== false}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-accent"
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition">نشر في الموقع العام</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="is_happening_now"
                                        defaultChecked={initialData?.is_happening_now}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-accent"
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition">تقام الآن (تفعيل تسجيل الحضور)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logistics Section */}
                <section>
                    <h3 className="text-lg font-bold mb-6">البيانات اللوجستية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="form-group">
                            <label className="label">تاريخ البدء</label>
                            <input type="date" name="start_date" defaultValue={initialData?.start_date} className="input" />
                        </div>
                        <div className="form-group">
                            <label className="label">تاريخ الانتهاء</label>
                            <input type="date" name="end_date" defaultValue={initialData?.end_date} className="input" />
                        </div>
                        <div className="form-group">
                            <label className="label">إجمالي المقاعد</label>
                            <input type="number" name="total_seats" defaultValue={initialData?.total_seats || 0} required className="input" min="0" />
                        </div>
                        <div className="form-group">
                            <label className="label">سعر الدورة (ريال)</label>
                            <input type="number" step="0.01" name="price" defaultValue={initialData?.price || 0} className="input" min="0" />
                        </div>
                    </div>
                </section>

                {/* Actions */}
                <div className="pt-8 border-t border-border flex justify-end gap-4">
                    <Link href="/admin/dashboard/courses" className="btn btn-secondary">
                        إلغاء
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ minWidth: '160px' }}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save size={18} /> {isEdit ? 'حفظ التعديلات' : 'نشر الدورة الآن'}
                            </span>
                        )}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .dashed-border {
                    border: 2px dashed var(--color-border);
                    background: transparent;
                }
                .dashed-border:hover {
                    border-color: var(--color-accent);
                    background: var(--color-background);
                }
            `}</style>
        </div>
    );
}


'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Save, Lock, FileText, Link as LinkIcon, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ArchiveFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ArchiveForm({ initialData, isEdit = false }: ArchiveFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);
        const accessCode = formData.get('access_code') as string;

        // Validation for 6-digit number
        if (!/^\d{1,6}$/.test(accessCode)) {
            setError('يجب أن يكون كود الأرشيف أرقاماً فقط ولا يتجاوز 6 خانات');
            setLoading(false);
            return;
        }

        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            content: formData.get('content'),
            file_url: formData.get('file_url'),
            access_code: accessCode,
            is_active: formData.get('is_active') === 'on',
        };

        try {
            let resultError;
            if (isEdit) {
                const { error } = await supabase.from('archives').update(data).eq('id', initialData.id);
                resultError = error;
            } else {
                const { error } = await supabase.from('archives').insert(data);
                resultError = error;
            }

            if (resultError) throw resultError;

            setSuccess(isEdit ? 'تم تحديث الأرشيف بنجاح' : 'تم إنشاء الأرشيف بنجاح');

            setTimeout(() => {
                router.push('/admin/dashboard/archives');
                router.refresh();
            }, 1500);

        } catch (err: any) {
            console.error('Error saving archive:', err);
            setError(err.message || 'حدث خطأ أثناء الحفظ');
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

            <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="form-group">
                        <label className="label">عنوان الأرشيف</label>
                        <div className="relative">
                            <FileText className="absolute right-3 top-3 text-gray-400" size={18} />
                            <input
                                name="title"
                                defaultValue={initialData?.title}
                                required
                                className="input pr-10"
                                placeholder="مثال: صور ملتقى الرسالة الأول"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label text-accent font-bold flex items-center gap-2">
                            <Lock size={16} /> كود الوصول (بحد أقصى 6 أرقام)
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-3 text-accent" size={18} />
                            <input
                                name="access_code"
                                defaultValue={initialData?.access_code}
                                required
                                maxLength={6}
                                className="input pr-10 border-accent focus:ring-accent"
                                placeholder="مثال: 123456"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">هذا الكود هو ما سيتم طلبه من الزوار للوصول للمحتوى</p>
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">رابط المحتوى أو الملف خارجي</label>
                    <div className="relative">
                        <LinkIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                        <input
                            name="file_url"
                            defaultValue={initialData?.file_url}
                            className="input pr-10"
                            placeholder="مثال: رابط Drive أو موقع خارجي"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">وصف مختصر (يظهر في القائمة)</label>
                    <textarea
                        name="description"
                        defaultValue={initialData?.description}
                        rows={2}
                        className="input"
                        placeholder="نبذة بسيطة عن محتوى هذا الأرشيف..."
                    />
                </div>

                <div className="form-group">
                    <label className="label">المحتوى التفصيلي (اختياري)</label>
                    <textarea
                        name="content"
                        defaultValue={initialData?.content}
                        rows={5}
                        className="input"
                        placeholder="اكتب أي نصوص أو روابط إضافية هنا..."
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked={initialData?.is_active !== false}
                        id="is_active"
                        className="w-5 h-5 accent-accent"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">نشط (متاح للبحث بالكود)</label>
                </div>

                <div className="pt-6 border-t border-border flex justify-end gap-4">
                    <Link href="/admin/dashboard/archives" className="btn btn-secondary">
                        إلغاء
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary min-w-[140px]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <span className="flex items-center gap-2">
                                <Save size={18} /> {isEdit ? 'حفظ التعديلات' : 'إنشاء الأرشيف'}
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}


'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, Upload } from 'lucide-react';
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data: any = {
            title: formData.get('title'),
            description: formData.get('description'),
            instructor: formData.get('instructor'),
            start_date: formData.get('start_date'),
            end_date: formData.get('end_date'),
            total_seats: parseInt(formData.get('total_seats') as string),
            price: parseFloat(formData.get('price') as string),
            status: formData.get('status'),
            is_happening_now: formData.get('is_happening_now') === 'on',
            is_active: formData.get('is_active') === 'on',
        };

        if (!isEdit) {
            data.available_seats = data.total_seats;
        }

        try {
            if (banner) {
                const fileExt = banner.name.split('.').pop();
                const fileName = `banners/${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(fileName, banner);
                if (uploadError) throw uploadError;
                const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
                data.banner_url = publicUrlData.publicUrl;
            }

            if (isEdit) {
                const { error } = await supabase.from('courses').update(data).eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('courses').insert(data);
                if (error) throw error;
            }

            router.push('/admin/dashboard/courses');
            router.refresh();
        } catch (error) {
            console.error('Error saving course:', error);
            alert('حدث خطأ أثناء حفظ الدورة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            {/* ... existing fields ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="label">عنوان الدورة</label>
                    <input name="title" defaultValue={initialData?.title} required className="input" />
                </div>
                <div>
                    <label className="label">المدرب</label>
                    <input name="instructor" defaultValue={initialData?.instructor} className="input" />
                </div>
                {/* ... other standard fields ... */}
            </div>

            {/* New Fields: Banner, Status, Happening Now */}
            <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">إعدادات العرض والحالة</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label">بانر الدورة (صورة عرض)</label>
                        <div className="mt-2 flex items-center gap-4">
                            {bannerPreview && (
                                <img src={bannerPreview} alt="Preview" className="h-20 w-32 object-cover rounded-lg border dark:border-gray-600" />
                            )}
                            <label className="cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center gap-2">
                                <Upload size={16} />
                                <span>اختر صورة</span>
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

                    <div>
                        <label className="label">حالة الدورة</label>
                        <select name="status" defaultValue={initialData?.status || 'upcoming'} className="input">
                            <option value="upcoming">قريباً</option>
                            <option value="active">متاحة للتسجيل</option>
                            <option value="completed">منتهية</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            name="is_happening_now"
                            id="is_happening_now"
                            defaultChecked={initialData?.is_happening_now}
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <label htmlFor="is_happening_now" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            تقام الآن (تظهر في الشريط الجانبي لتسجيل الحضور)
                        </label>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            defaultChecked={initialData?.is_active !== false}
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            نشط (تظهر في الموقع)
                        </label>
                    </div>
                </div>
            </div>

            {/* Rest of form inputs (dates, seats, price, description) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="label">تاريخ البداية</label>
                    <input type="date" name="start_date" defaultValue={initialData?.start_date} className="input" />
                </div>
                <div>
                    <label className="label">تاريخ النهاية</label>
                    <input type="date" name="end_date" defaultValue={initialData?.end_date} className="input" />
                </div>
                <div>
                    <label className="label">عدد المقاعد الكلي</label>
                    <input type="number" name="total_seats" defaultValue={initialData?.total_seats} required className="input" />
                </div>
                <div>
                    <label className="label">السعر (ريال)</label>
                    <input type="number" step="0.01" name="price" defaultValue={initialData?.price || 0} className="input" />
                </div>
            </div>

            <div>
                <label className="label">الوصف</label>
                <textarea name="description" rows={4} defaultValue={initialData?.description} className="input" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Link href="/admin/dashboard/courses" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                    إلغاء
                </Link>
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>
        </form>
    );
}

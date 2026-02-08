
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewKitPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        try {
            let fileUrl = '';
            let coverUrl = '';

            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { data, error } = await supabase.storage.from('media').upload(`kits/${fileName}`, file);
                if (error) throw error;
                // Get public URL
                const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(`kits/${fileName}`);
                fileUrl = publicUrlData.publicUrl;
            }

            if (cover) {
                const fileExt = cover.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { data, error } = await supabase.storage.from('media').upload(`covers/${fileName}`, cover);
                if (error) throw error;
                const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(`covers/${fileName}`);
                coverUrl = publicUrlData.publicUrl;
            }

            const { error: insertError } = await supabase.from('educational_kits').insert({
                title,
                description,
                file_url: fileUrl,
                cover_url: coverUrl,
            });

            if (insertError) throw insertError;

            router.push('/admin/dashboard/kits');
            router.refresh();

        } catch (error) {
            console.error('Error creating kit:', error);
            alert('حدث خطأ أثناء إنشاء الحقيبة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">إضافة حقيبة تعليمية جديدة</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">العنوان</label>
                    <input name="title" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
                    <textarea name="description" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">صورة الغلاف</label>
                    <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-300" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الملف (PDF, DOCX, etc.)</label>
                    <input type="file" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-300" />
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
                        {loading ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                </div>
            </form>
        </div>
    );
}

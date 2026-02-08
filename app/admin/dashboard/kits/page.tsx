
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function KitsPage() {
    const supabase = createClient();
    const { data: kits } = await supabase.from('educational_kits').select('*').order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">الحقائب التعليمية</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة الملفات والحقائب التعليمية</p>
                </div>
                <Link
                    href="/admin/dashboard/kits/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                >
                    <span>إضافة حقيبة جديدة</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kits?.map((kit) => (
                    <div key={kit.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {kit.cover_url && (
                            <img src={kit.cover_url} alt={kit.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{kit.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">{kit.description}</p>
                            <div className="flex justify-between items-center">
                                <a href={kit.file_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">تحميل الملف</a>
                                <span className={`px-2 py-1 rounded text-xs ${kit.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {kit.is_active ? 'نشط' : 'غير نشط'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

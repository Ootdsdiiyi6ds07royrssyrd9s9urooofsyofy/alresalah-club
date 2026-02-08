
import { createClient } from '@/lib/supabase/client'; // Client-side for public viewing usually? Or server component.
// Using server component for initial load
import { createClient as createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function PublicKitsPage() {
    const supabase = await createServerClient();
    const { data: kits } = await supabase
        .from('educational_kits')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                        الحقائب التعليمية
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                        مجموعة من المصادر والمراجع التعليمية المفيدة
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {kits?.map((kit) => (
                        <div key={kit.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                                {kit.cover_url ? (
                                    <img src={kit.cover_url} alt={kit.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{kit.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{kit.description}</p>
                                <a
                                    href={kit.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    تحميل الحقيبة
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

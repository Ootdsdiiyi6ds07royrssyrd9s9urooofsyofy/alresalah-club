
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AttendanceListPage() {
    const supabase = createClient();

    // Fetch courses that are happening now OR active
    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('is_happening_now', { ascending: false });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">كشوفات الحضور</h1>
                <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft size={20} /> عودة
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses?.map(course => (
                    <Link key={course.id} href={`/admin/dashboard/attendance/${course.id}`} className="block group">
                        <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 transition hover:translate-y-[-2px] ${course.is_happening_now ? 'border-l-green-500 ring-2 ring-green-100 dark:ring-green-900/20' : 'border-l-gray-300 dark:border-l-gray-600'}`}>
                            {course.is_happening_now && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2 inline-block font-bold animate-pulse">
                                    تقام الآن
                                </span>
                            )}
                            <h3 className="text-lg font-bold group-hover:text-indigo-600 transition">{course.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">{course.instructor || 'بدون مدرب'}</p>
                            <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                                <span>{course.start_date}</span>
                                <span>تسجيل الحضور ←</span>
                            </div>
                        </div>
                    </Link>
                ))}
                {courses?.length === 0 && (
                    <div className="col-span-full text-center p-12 bg-white dark:bg-gray-800 rounded-lg text-gray-500">
                        لا توجد دورات نشطة حالياً
                    </div>
                )}
            </div>
        </div>
    );
}

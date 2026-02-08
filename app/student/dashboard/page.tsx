
import { getStudentSession } from '@/lib/auth/student-session';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function StudentDashboard() {
    const session = await getStudentSession();
    if (!session) {
        redirect('/student/login');
    }

    const supabase = await createClient();
    const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('bawaba_id', session.sub || session.id)
        .single();

    // Fetch registered courses
    // Assuming applicants table links by email? Or we need to link properly.
    // Let's assume email linking for now as it's the common denominator
    const { data: myCourses } = await supabase
        .from('applicants')
        .select('*, courses(*)')
        .eq('email', session.email);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">مرحباً، {session.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300">نحن سعداء برؤيتك مجدداً في نادي الرسالة التعليمي.</p>
                    </div>
                    {session.picture && <img src={session.picture} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-indigo-100 dark:border-indigo-900" />}
                </div>

                {/* My Courses */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">دوراتي المسجلة</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {myCourses?.map((app: any) => (
                            <div key={app.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold mb-2">{app.courses.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">الحالة: {APP_STATUS_MAP[app.status] || app.status}</p>
                                <div className="flex justify-end">
                                    <Link href={`/courses/${app.courses.id}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                        عرض التفاصيل ←
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {(!myCourses || myCourses.length === 0) && (
                            <p className="text-gray-500 col-span-2 text-center py-8">لم تقم بالتسجيل في أي دورات بعد.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const APP_STATUS_MAP: Record<string, string> = {
    pending: 'قيد المراجعة',
    approved: 'مقبول',
    rejected: 'مرفوض'
};


import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Mail, Phone, Search } from 'lucide-react';

export default async function StudentListPage({ searchParams }: { searchParams: { q?: string } }) {
    const supabase = createClient();
    const query = searchParams.q || '';

    let studentQuery = supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

    if (query) {
        studentQuery = studentQuery.ilike('name', `%${query}%`);
    }

    const { data: students } = await studentQuery;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">كشفيات الطلاب</h1>
                {/* Search Box */}
                <form className="relative">
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="بحث عن طالب..."
                        className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="text-right p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">الطالب</th>
                                <th className="text-right p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">معلومات التواصل</th>
                                <th className="text-right p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">تاريخ الانضمام</th>
                                <th className="text-center p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {students?.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {student.avatar_url ? (
                                                <img src={student.avatar_url} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 font-bold">
                                                    {student.name?.[0] || '?'}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                                                <div className="text-xs text-gray-500">ID: {student.bawaba_id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 space-y-1">
                                        {student.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail size={14} /> {student.email}
                                            </div>
                                        )}
                                        {student.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Phone size={14} /> <span dir="ltr">{student.phone}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(student.created_at).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            نشط
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {students?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        لا يوجد طلاب مطابقين للبحث
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

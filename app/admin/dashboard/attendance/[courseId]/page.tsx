
'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Save, Check, X, Clock, FileText } from 'lucide-react';

export default function AttendancePage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const courseId = params.courseId as string;

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [attendance, setAttendance] = useState<Record<string, string>>({}); // studentId -> status
    const [saving, setSaving] = useState(false);
    const [notes, setNotes] = useState<Record<string, string>>({}); // studentId -> notes

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        try {
            // 1. Fetch Course Info
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            if (courseError) throw courseError;
            setCourse(courseData);

            // 2. Fetch Enrolled Students (Applicants -> Students?)
            // We need to link applicants to students if possible, or just list applicants.
            // The requirement says "Show registered people".
            // Applicants table has `full_name`. 
            // Ideally we should use `students` table if they are synced, but `applicants` is the source of truth for course registration.
            // Let's use `applicants` for the list.
            const { data: applicantsHelper, error: applicantsError } = await supabase
                .from('applicants')
                .select('*')
                .eq('course_id', courseId)
                .eq('status', 'approved'); // Only approved? Or all? User said "registered".

            if (applicantsError) throw applicantsError;
            setStudents(applicantsHelper || []);

            // 3. Fetch Sessions
            const { data: sessionsData, error: sessionsError } = await supabase
                .from('course_sessions')
                .select('*')
                .eq('course_id', courseId)
                .order('date', { ascending: false });

            if (sessionsError) throw sessionsError;
            setSessions(sessionsData || []);

            if (sessionsData && sessionsData.length > 0) {
                // Select most recent or create new?
                // For now just letting user select or create.
                // Or auto-select first.
                // setSelectedSessionId(sessionsData[0].id);
                // fetchAttendance(sessionsData[0].id);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async (sessionId: string) => {
        setSelectedSessionId(sessionId);
        setAttendance({});
        setNotes({});
        try {
            const { data, error } = await supabase
                .from('attendance')
                .select('*')
                .eq('session_id', sessionId);

            if (error) throw error;

            if (data) {
                const newAttendance: Record<string, string> = {};
                const newNotes: Record<string, string> = {};
                data.forEach((record: any) => {
                    // We need to map applicant ID to student ID? 
                    // Wait, `attendance` table links to `student_id` (from `students` table).
                    // `applicants` table might not have `student_id`.
                    // This is a disconnect.
                    // If students register via Bawaba, they are in `students`.
                    // When they apply, we should link `applicants` to `students`?
                    // Currently `applicants` has email. `students` has email.
                    // We can join on email.
                    // OR, we can just store `applicant_id` in attendance?
                    // The schema said `student_id`.
                    // Let's assume we map by email for now or assume `applicants` are linked.
                    // For the Hackathon speed, let's just use `applicant_id` in `attendance` table instead of `student_id`?
                    // Or change schema. existing schema in `schema_update.sql` uses `student_id`.
                    // We need to find the `student_id` for each applicant.

                    // Allow simple solution: Update `attendance` to reference `applicants` OR `students`.
                    // Since specific requirement "System for students separate from admin", 
                    // students are in `students`.
                    // Applicants are course registrations.
                    // We should probably find the `student` record for the `applicant`.
                    // Let's assume we use `student_id` in attendance and we look it up.

                    if (record.student_id) newAttendance[record.student_id] = record.status;
                    if (record.notes) newNotes[record.student_id] = record.notes;
                });
                setAttendance(newAttendance);
                setNotes(newNotes);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const createSession = async () => {
        const title = prompt('عنوان الجلسة/المحاضرة:');
        if (!title) return;
        const date = new Date().toISOString().split('T')[0];

        try {
            const { data, error } = await supabase
                .from('course_sessions')
                .insert([{ course_id: courseId, title, date }])
                .select()
                .single();

            if (error) throw error;
            setSessions([data, ...sessions]);
            fetchAttendance(data.id);
        } catch (err) {
            alert('فشل إنشاء الجلسة');
        }
    };

    const markAttendance = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const saveAttendance = async () => {
        if (!selectedSessionId) return;
        setSaving(true);
        try {
            // We need `student_id` for each applicant.
            // Complex lookup: Applicant -> Email -> Student ID.
            // We can do this on the fly or bulk.

            const updates = [];
            for (const applicant of students) {
                const status = attendance[applicant.id] || 'absent'; // Default to absent? Or skip?
                // Wait, `attendance` state uses applicant.id as key for UI convenience.
                // But DB needs `student_id`.

                // Lookup student by email
                const { data: student } = await supabase.from('students').select('id').eq('email', applicant.email).single();

                if (student) {
                    updates.push({
                        session_id: selectedSessionId,
                        student_id: student.id,
                        status: status,
                        notes: notes[applicant.id] || null,
                        recorded_by: (await supabase.auth.getUser()).data.user?.id
                    });
                }
            }

            if (updates.length > 0) {
                const { error } = await supabase
                    .from('attendance')
                    .upsert(updates, { onConflict: 'session_id,student_id' });
                if (error) throw error;
                alert('تم حفظ التحضير بنجاح');
            } else {
                alert('لم يتم العثور على حسابات طلاب مرتبطة بالمتقدمين (تأكد من تسجيلهم دخول عبر بوابة)');
            }

        } catch (err: any) {
            console.error(err);
            alert('حدث خطأ: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>تحميل...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{course.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400">إدارة الحضور والغياب</p>
                </div>
                <button onClick={createSession} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                    <PlusIcon /> جلسة جديدة
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sessions Sidebar */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700 font-bold">الجلسات السابقة</div>
                    <div className="max-h-[500px] overflow-y-auto">
                        {sessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => fetchAttendance(session.id)}
                                className={`w-full text-right p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${selectedSessionId === session.id ? 'bg-indigo-50 dark:bg-indigo-900/50 border-r-4 border-r-indigo-600' : ''}`}
                            >
                                <div className="font-medium">{session.title}</div>
                                <div className="text-xs text-gray-500">{session.date}</div>
                            </button>
                        ))}
                        {sessions.length === 0 && <div className="p-4 text-center text-gray-500">لا يوجد جلسات</div>}
                    </div>
                </div>

                {/* Attendance List */}
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    {selectedSessionId ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">قائمة الطلاب</h2>
                                <button onClick={saveAttendance} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
                                    <Save size={18} /> {saving ? 'جاري الحفظ...' : 'حفظ الكشف'}
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b dark:border-gray-700">
                                            <th className="text-right p-3">اسم الطالب</th>
                                            <th className="text-center p-3">الحالة</th>
                                            <th className="text-right p-3">ملاحظات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-gray-700">
                                        {students.map(student => (
                                            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="p-3">
                                                    <div className="font-medium">{student.full_name}</div>
                                                    <div className="text-xs text-gray-500">{student.email}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'present')}
                                                            className={`p-2 rounded ${attendance[student.id] === 'present' ? 'bg-green-100 text-green-700 ring-2 ring-green-600' : 'bg-gray-100 text-gray-400 hover:bg-green-50'}`}
                                                            title="حاضر"
                                                        >
                                                            <Check size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'late')}
                                                            className={`p-2 rounded ${attendance[student.id] === 'late' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-600' : 'bg-gray-100 text-gray-400 hover:bg-yellow-50'}`}
                                                            title="متأخر"
                                                        >
                                                            <Clock size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'absent')}
                                                            className={`p-2 rounded ${attendance[student.id] === 'absent' ? 'bg-red-100 text-red-700 ring-2 ring-red-600' : 'bg-gray-100 text-gray-400 hover:bg-red-50'}`}
                                                            title="غائب"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none text-sm py-1"
                                                        placeholder="اضافة ملاحظة..."
                                                        value={notes[student.id] || ''}
                                                        onChange={(e) => setNotes({ ...notes, [student.id]: e.target.value })}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        {students.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-gray-500">لا يوجد طلاب مسجلين في هذه الدورة</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p>اختر جلسة من القائمة لعرض كشف الحضور</p>
                            <p className="text-sm mt-2">أو قم بإنشاء جلسة جديدة</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PlusIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
}


'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Save, Check, X, Clock, FileText, Plus, ChevronRight, User, Mail, Calendar } from 'lucide-react';

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
    const [attendance, setAttendance] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [notes, setNotes] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        try {
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            if (courseError) throw courseError;
            setCourse(courseData);

            const { data: applicantsHelper, error: applicantsError } = await supabase
                .from('applicants')
                .select('*')
                .eq('course_id', courseId)
                .eq('status', 'approved');

            if (applicantsError) throw applicantsError;
            setStudents(applicantsHelper || []);

            const { data: sessionsData, error: sessionsError } = await supabase
                .from('course_sessions')
                .select('*')
                .eq('course_id', courseId)
                .order('date', { ascending: false });

            if (sessionsError) throw sessionsError;
            setSessions(sessionsData || []);

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
            const updates = [];
            for (const applicant of students) {
                const status = attendance[applicant.id] || 'absent';

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

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
            <Loader2 className="animate-spin" />
            <span>جاري تحميل البيانات...</span>
        </div>
    );

    return (
        <div style={{ spaceY: 'var(--spacing-lg)' }}>
            {/* Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)',
                background: 'var(--color-surface)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                borderBottom: '4px solid var(--color-primary)'
            }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-text)' }}>{course.title}</h1>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xs)' }}>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} /> {course.start_date}
                        </span>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} /> {course.instructor}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <Link href="/admin/dashboard/attendance" className="btn btn-secondary">
                        <ChevronRight size={18} /> عودة
                    </Link>
                    <button onClick={createSession} className="btn btn-primary">
                        <Plus size={18} /> جلسة جديدة
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: 'var(--spacing-xl)' }}>
                {/* Sessions Sidebar */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', height: 'fit-content' }}>
                    <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-surface-elevated)', borderBottom: '1px solid var(--color-border)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Clock size={18} /> الجلسات
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {sessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => fetchAttendance(session.id)}
                                style={{
                                    width: '100%',
                                    textAlign: 'right',
                                    padding: 'var(--spacing-lg)',
                                    borderBottom: '1px solid var(--color-border)',
                                    background: selectedSessionId === session.id ? 'var(--color-surface-elevated)' : 'transparent',
                                    borderRight: selectedSessionId === session.id ? '4px solid var(--color-primary)' : '0',
                                    transition: 'all var(--transition-fast)',
                                    cursor: 'pointer'
                                }}
                                className="session-item"
                            >
                                <div style={{ fontWeight: '600', color: selectedSessionId === session.id ? 'var(--color-primary)' : 'var(--color-text)' }}>{session.title}</div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>{new Date(session.date).toLocaleDateString('ar-SA')}</div>
                            </button>
                        ))}
                        {sessions.length === 0 && (
                            <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                <FileText size={40} style={{ margin: '0 auto var(--spacing-md)', opacity: 0.3 }} />
                                <p>لا توجد جلسات حالياً</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {selectedSessionId ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)' }}>
                                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>تحضير الطلاب</h2>
                                <button
                                    onClick={saveAttendance}
                                    disabled={saving}
                                    className="btn btn-primary"
                                    style={{ padding: 'var(--spacing-sm) var(--spacing-xl)' }}
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {saving ? 'جاري الحفظ...' : 'حفظ الكشف'}
                                </button>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                                    <thead style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
                                        <tr>
                                            <th style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>الطالب</th>
                                            <th style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>تسجيل الحضور</th>
                                            <th style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>ملاحظات ومذكرة</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(student => (
                                            <tr key={student.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <td style={{ padding: 'var(--spacing-lg)' }}>
                                                    <div style={{ fontWeight: '600' }}>{student.full_name}</div>
                                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Mail size={12} /> {student.email}
                                                    </div>
                                                </td>
                                                <td style={{ padding: 'var(--spacing-lg)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-sm)' }}>
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'present')}
                                                            title="حاضر"
                                                            style={{
                                                                padding: 'var(--spacing-sm)',
                                                                borderRadius: 'var(--radius-md)',
                                                                border: '1px solid var(--color-border)',
                                                                background: attendance[student.id] === 'present' ? 'var(--color-success)' : 'transparent',
                                                                color: attendance[student.id] === 'present' ? 'white' : 'var(--color-text-muted)',
                                                                cursor: 'pointer',
                                                                transition: 'all var(--transition-fast)'
                                                            }}
                                                        >
                                                            <Check size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'late')}
                                                            title="متأخر"
                                                            style={{
                                                                padding: 'var(--spacing-sm)',
                                                                borderRadius: 'var(--radius-md)',
                                                                border: '1px solid var(--color-border)',
                                                                background: attendance[student.id] === 'late' ? 'var(--color-warning)' : 'transparent',
                                                                color: attendance[student.id] === 'late' ? 'white' : 'var(--color-text-muted)',
                                                                cursor: 'pointer',
                                                                transition: 'all var(--transition-fast)'
                                                            }}
                                                        >
                                                            <Clock size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'absent')}
                                                            title="غائب"
                                                            style={{
                                                                padding: 'var(--spacing-sm)',
                                                                borderRadius: 'var(--radius-md)',
                                                                border: '1px solid var(--color-border)',
                                                                background: attendance[student.id] === 'absent' ? 'var(--color-error)' : 'transparent',
                                                                color: attendance[student.id] === 'absent' ? 'white' : 'var(--color-text-muted)',
                                                                cursor: 'pointer',
                                                                transition: 'all var(--transition-fast)'
                                                            }}
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td style={{ padding: 'var(--spacing-lg)' }}>
                                                    <input
                                                        className="input"
                                                        placeholder="اضافة ملاحظة..."
                                                        style={{ height: '36px', fontSize: 'var(--font-size-sm)', background: 'transparent' }}
                                                        value={notes[student.id] || ''}
                                                        onChange={(e) => setNotes({ ...notes, [student.id]: e.target.value })}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        {students.length === 0 && (
                                            <tr>
                                                <td colSpan={3} style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                    لا يوجد طلاب معتمدين لهذه الدورة حتى الآن
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--color-text-muted)', padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
                            <FileText size={64} style={{ opacity: 0.2, marginBottom: 'var(--spacing-lg)' }} />
                            <h3 style={{ fontSize: 'var(--font-size-xl)' }}>بانتظار عرض الجلسة</h3>
                            <p style={{ maxWidth: '300px', marginTop: 'var(--spacing-sm)' }}>يرجى اختيار جلسة من القائمة الجانبية لعرض كشف الحضور، أو إنشاء جلسة جديدة لليوم.</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .session-item:hover:not(:disabled) {
                    background-color: var(--color-surface);
                }
            `}</style>
        </div>
    );
}

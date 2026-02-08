
import { getStudentSession } from '@/lib/auth/student-session';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, XCircle, User } from 'lucide-react';

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
    const { data: myCourses } = await supabase
        .from('applicants')
        .select('*, courses(*)')
        .eq('email', session.email);

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-2xl) 0', background: 'var(--color-background)' }}>
            <div className="container">
                {/* Back Link */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <a href="/" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', width: 'fit-content' }}>
                        <span>←</span> العودة للرئيسية
                    </a>
                </div>

                {/* Welcome Header */}
                <div className="card" style={{
                    marginBottom: 'var(--spacing-2xl)',
                    background: 'var(--grad-navy)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-lg)'
                }}>
                    <div>
                        <h1 className="gradient-text" style={{
                            fontSize: 'var(--font-size-3xl)',
                            marginBottom: 'var(--spacing-sm)',
                            background: 'linear-gradient(135deg, var(--color-gold) 0%, #fff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            مرحباً، {session.name}
                        </h1>
                        <p style={{ opacity: 0.9, fontSize: 'var(--font-size-md)' }}>
                            نحن سعداء برؤيتك مجدداً في نادي الرسالة التعليمي
                        </p>
                    </div>
                    {session.picture ? (
                        <img
                            src={session.picture}
                            alt="Avatar"
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '4px solid var(--color-gold)',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            border: '4px solid var(--color-gold)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <User size={40} />
                        </div>
                    )}
                </div>

                {/* My Courses Section */}
                <div>
                    <h2 style={{
                        fontSize: 'var(--font-size-2xl)',
                        marginBottom: 'var(--spacing-lg)',
                        color: 'var(--color-text)'
                    }}>
                        دوراتي المسجلة
                    </h2>

                    {myCourses && myCourses.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: 'var(--spacing-xl)'
                        }}>
                            {myCourses.map((app: any) => (
                                <Link
                                    href={`/courses/${app.courses.id}`}
                                    key={app.id}
                                    className="card hover-scale fade-in"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Status Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 'var(--spacing-md)',
                                        right: 'var(--spacing-md)',
                                        zIndex: 10
                                    }}>
                                        {app.status === 'approved' && (
                                            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                                <CheckCircle size={14} />
                                                {APP_STATUS_MAP[app.status]}
                                            </span>
                                        )}
                                        {app.status === 'pending' && (
                                            <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                                <Clock size={14} />
                                                {APP_STATUS_MAP[app.status]}
                                            </span>
                                        )}
                                        {app.status === 'rejected' && (
                                            <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                                <XCircle size={14} />
                                                {APP_STATUS_MAP[app.status]}
                                            </span>
                                        )}
                                    </div>

                                    {/* Course Banner */}
                                    <div style={{ height: '180px', backgroundColor: 'var(--color-surface)', position: 'relative', overflow: 'hidden' }}>
                                        {app.courses.banner_url ? (
                                            <img
                                                src={app.courses.banner_url}
                                                alt={app.courses.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'var(--grad-navy)',
                                                color: 'white'
                                            }}>
                                                <BookOpen size={48} opacity={0.5} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Info */}
                                    <div style={{ padding: 'var(--spacing-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{
                                            fontSize: 'var(--font-size-lg)',
                                            fontWeight: 'bold',
                                            marginBottom: 'var(--spacing-sm)',
                                            color: 'var(--color-text)'
                                        }}>
                                            {app.courses.title}
                                        </h3>

                                        {app.courses.instructor && (
                                            <p style={{
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--color-text-secondary)',
                                                marginBottom: 'var(--spacing-md)'
                                            }}>
                                                المدرب: {app.courses.instructor}
                                            </p>
                                        )}

                                        <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-md)' }}>
                                            <span style={{
                                                color: 'var(--color-primary)',
                                                fontSize: 'var(--font-size-sm)',
                                                fontWeight: '500'
                                            }}>
                                                عرض التفاصيل ←
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="card" style={{
                            textAlign: 'center',
                            padding: 'var(--spacing-2xl)',
                            background: 'var(--color-surface)'
                        }}>
                            <BookOpen size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.3, color: 'var(--color-text-secondary)' }} />
                            <p style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-lg)',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                لم تقم بالتسجيل في أي دورات بعد
                            </p>
                            <Link href="/courses" className="btn btn-primary">
                                تصفح الدورات المتاحة
                            </Link>
                        </div>
                    )}
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

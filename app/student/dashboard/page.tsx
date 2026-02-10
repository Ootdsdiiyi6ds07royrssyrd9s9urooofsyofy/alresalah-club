
import { getStudentSession } from '@/lib/auth/student-session';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, XCircle, User, ArrowLeft, LogOut } from 'lucide-react';

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
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-xl) 0', background: 'var(--color-background)' }}>
            <div className="container">
                {/* Header Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <Link href="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors font-medium">
                        <ArrowLeft size={18} /> العودة للرئيسية
                    </Link>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <Link href="/student/profile" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                            <User size={16} /> الملف الشخصي
                        </Link>
                        <Link href="/api/auth/logout" className="btn btn-accent" style={{ padding: '8px 16px', fontSize: '14px' }}>
                            <LogOut size={16} /> خروج
                        </Link>
                    </div>
                </div>

                {/* Welcome Banner */}
                <div className="card-elevated fade-in" style={{
                    marginBottom: 'var(--spacing-2xl)',
                    background: 'var(--grad-gold)',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: 'var(--spacing-2xl)',
                    border: 'none'
                }}>
                    {/* Decorative Elements */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        left: '-50px',
                        width: '200px',
                        height: '200px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        zIndex: 0
                    }}></div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--spacing-xl)',
                        position: 'relative',
                        zIndex: 1,
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ color: 'var(--color-navy)' }}>
                            <h1 style={{
                                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                                fontWeight: '800',
                                marginBottom: 'var(--spacing-xs)',
                            }}>
                                مرحباً، {session.name}
                            </h1>
                            <p style={{ fontSize: 'var(--font-size-lg)', opacity: 0.8, fontWeight: '500' }}>
                                يسعدنا متابعتك لرحلتك التعليمية معنا في نادي الرسالة
                            </p>
                        </div>

                        <div style={{ position: 'relative' }}>
                            {session.picture ? (
                                <img
                                    src={session.picture}
                                    alt={session.name}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '24px',
                                        border: '4px solid white',
                                        boxShadow: 'var(--shadow-lg)',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '24px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '4px solid white',
                                    color: 'var(--color-navy)'
                                }}>
                                    <User size={50} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-2xl)' }}>
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700' }}>دوراتي الحالية</h2>
                            <Link href="/courses" className="text-sm font-bold text-accent hover:underline">تصفح الدورات الجديدة</Link>
                        </div>

                        {myCourses && myCourses.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: 'var(--spacing-xl)'
                            }}>
                                {myCourses.map((app: any) => (
                                    <div key={app.id} className="card-elevated hover-scale fade-in" style={{
                                        padding: 0,
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{ height: '160px', position: 'relative' }}>
                                            {app.courses.banner_url ? (
                                                <img src={app.courses.banner_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'var(--grad-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <BookOpen size={40} color="white" opacity={0.3} />
                                                </div>
                                            )}
                                            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                                {app.status === 'approved' && <span className="badge badge-success">مقبول</span>}
                                                {app.status === 'pending' && <span className="badge badge-warning">قيد المراجعة</span>}
                                                {app.status === 'rejected' && <span className="badge badge-error">مرفوض</span>}
                                            </div>
                                        </div>
                                        <div style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
                                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>{app.courses.title}</h3>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: 'var(--spacing-lg)' }}>{app.courses.instructor}</p>

                                            <Link href={`/courses/${app.courses.id}`} className="btn btn-secondary" style={{ width: '100%', fontSize: '14px' }}>
                                                عرض تفاصيل الدورة <ArrowLeft size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card text-center" style={{ padding: 'var(--spacing-2xl)', backgroundColor: 'var(--color-surface)' }}>
                                <BookOpen size={60} style={{ margin: '0 auto var(--spacing-md)', opacity: 0.1 }} />
                                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>لا توجد دورات مسجلة</h3>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>ابدأ رحلتك التعليمية اليوم بالتسجيل في إحدى دوراتنا</p>
                                <Link href="/courses" className="btn btn-primary">تصفح جميع الدورات</Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

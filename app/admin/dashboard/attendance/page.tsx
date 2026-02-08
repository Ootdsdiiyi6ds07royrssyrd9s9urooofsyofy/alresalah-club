
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ChevronLeft, MapPin, User, Calendar, Clock } from 'lucide-react';

export default async function AttendanceListPage() {
    const supabase = await createClient();

    // Fetch courses that are happening now OR active
    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('is_happening_now', { ascending: false });

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', spaceY: 'var(--spacing-lg)' }}>
            {/* Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-text)' }}>كشوفات الحضور</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>اختر الدورة لتسجيل حضور الطلاب اليوم</p>
                </div>
                <Link href="/admin/dashboard" className="btn btn-secondary btn-sm" style={{ gap: 'var(--spacing-xs)' }}>
                    <span>العودة للرئيسية</span>
                    <ChevronLeft size={16} />
                </Link>
            </div>

            {/* Courses Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 'var(--spacing-lg)'
            }}>
                {courses?.map(course => (
                    <Link key={course.id} href={`/admin/dashboard/attendance/${course.id}`} className="fade-in" style={{ textDecoration: 'none' }}>
                        <div className="card hover-scale" style={{
                            height: '100%',
                            borderRight: course.is_happening_now ? '4px solid var(--color-success)' : '4px solid var(--color-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}>
                            {course.is_happening_now && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'var(--spacing-md)',
                                    left: 'var(--spacing-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-xs)',
                                    background: 'var(--color-success-bg)',
                                    color: 'var(--color-success)',
                                    padding: '4px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: 'var(--font-size-xs)',
                                    fontWeight: 'bold'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--color-success)',
                                        animation: 'pulse 2s infinite'
                                    }} />
                                    تقام الآن
                                </div>
                            )}

                            <h3 style={{
                                fontSize: 'var(--font-size-lg)',
                                fontWeight: 'bold',
                                color: 'var(--color-primary)',
                                marginBottom: 'var(--spacing-sm)',
                                marginTop: course.is_happening_now ? 'var(--spacing-lg)' : '0'
                            }}>
                                {course.title}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                    <User size={14} />
                                    <span>{course.instructor || 'المحاضر غير محدد'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                    <Calendar size={14} />
                                    <span>{course.start_date || 'تاريخ غير محدد'}</span>
                                </div>
                            </div>

                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                paddingTop: 'var(--spacing-md)',
                                borderTop: '1px solid var(--color-border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '500', color: 'var(--color-primary)' }}>تسجيل الحضور</span>
                                <ChevronLeft size={16} style={{ color: 'var(--color-primary)' }} />
                            </div>
                        </div>
                    </Link>
                ))}

                {(!courses || courses.length === 0) && (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
                        <Clock size={48} style={{ margin: '0 auto var(--spacing-md)', color: 'var(--color-text-muted)', opacity: 0.5 }} />
                        <h3 style={{ color: 'var(--color-text)', marginBottom: 'var(--spacing-sm)' }}>لا توجد دورات نشطة</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>ستظهر الدورات النشطة هنا لتتمكن من تحضير الطلاب</p>
                    </div>
                )}
            </div>

            );
}

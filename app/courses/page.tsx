import { createClient } from '@/lib/supabase/server'

export default async function CoursesListPage() {
    const supabase = await createClient()
    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-2xl) 0', background: 'var(--color-background)' }}>
            <div className="container">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <a href="/" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', width: 'fit-content' }}>
                        <span>←</span> العودة للرئيسية
                    </a>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 className="gradient-text" style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-sm)' }}>الدورات التدريبية</h1>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        طوّر مهاراتك مع نخبة من المدربين في برامجنا التخصصية
                    </p>
                </div>

                {courses && courses.length > 0 ? (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: 'var(--spacing-xl)',
                        }}
                    >
                        {courses.map((course) => (
                            <div key={course.id} className="card hover-scale fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-xs)' }}>
                                        <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)' }}>{course.title}</h3>
                                        <div style={{ padding: '4px 12px', background: 'var(--grad-gold)', color: 'var(--color-navy)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', fontWeight: 'bold' }}>
                                            {course.price > 0 ? `${course.price} ريال` : 'مجاني'}
                                        </div>
                                    </div>
                                    {course.description && (
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: '1.6', height: '3.2em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {course.description}
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', flexGrow: 1 }}>
                                    {course.instructor && (
                                        <div style={{ fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>👨‍🏫 المحاضر: </span>
                                            <span style={{ fontWeight: 500 }}>{course.instructor}</span>
                                        </div>
                                    )}
                                    {course.start_date && (
                                        <div style={{ fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>📅 تبدأ في: </span>
                                            <span style={{ fontWeight: 500 }}>{new Date(course.start_date).toLocaleDateString('ar-SA')}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>المقاعد المتاحة</span>
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: course.available_seats > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                                            {course.available_seats} / {course.total_seats}
                                        </span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${(course.available_seats / course.total_seats) * 100}%`,
                                                background: course.available_seats > 10 ? 'var(--color-success)' : 'var(--color-warning)',
                                                transition: 'width 1s ease-out',
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                                    <a href={`/courses/${course.id}`} className="btn btn-secondary">
                                        التفاصيل
                                    </a>
                                    <a href={`/register?courseId=${course.id}`} className="btn btn-primary">
                                        سجل الآن
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📚</div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>لا توجد دورات متاحة حالياً</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>يرجى العودة لاحقاً لمتابعة جديد دوراتنا.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

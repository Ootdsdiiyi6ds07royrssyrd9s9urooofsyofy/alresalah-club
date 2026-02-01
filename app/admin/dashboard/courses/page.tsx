import { createClient } from '@/lib/supabase/server'
import ShareButton from '@/components/ShareButton'

export default async function CoursesPage() {
    const supabase = await createClient()
    const { data: courses, error } = await (supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false }) as any)

    if (error) {
        console.error('Error fetching courses:', error)
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>إدارة الدورات</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        إدارة جميع الدورات وتوافر المقاعد
                    </p>
                </div>
                <a href="/admin/dashboard/courses/new" className="btn btn-primary">
                    + إضافة دورة جديدة
                </a>
            </div>

            {courses && courses.length > 0 ? (
                <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    {courses.map((course: any) => (
                        <div key={course.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                                        <h3>{course.title}</h3>
                                        <span className={`badge ${course.is_active ? 'badge-success' : 'badge-error'}`}>
                                            {course.is_active ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </div>
                                    {course.description && (
                                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                                            {course.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xl)', fontSize: 'var(--font-size-sm)' }}>
                                        {course.instructor && (
                                            <div>
                                                <span style={{ color: 'var(--color-text-muted)' }}>المحاضر: </span>
                                                <span style={{ fontWeight: 500 }}>{course.instructor}</span>
                                            </div>
                                        )}
                                        {course.start_date && (
                                            <div>
                                                <span style={{ color: 'var(--color-text-muted)' }}>تبدأ في: </span>
                                                <span style={{ fontWeight: 500 }}>{new Date(course.start_date).toLocaleDateString('ar-SA')}</span>
                                            </div>
                                        )}
                                        {course.price > 0 && (
                                            <div>
                                                <span style={{ color: 'var(--color-text-muted)' }}>السعر: </span>
                                                <span style={{ fontWeight: 500 }}>{course.price} ريال</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    <ShareButton entityType="course" entityId={course.id} title={course.title} />
                                    <a href={`/admin/dashboard/courses/${course.id}/edit`} className="btn btn-secondary btn-sm">
                                        تعديل
                                    </a>
                                </div>
                            </div>

                            {/* Seat Availability */}
                            <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                                    <span style={{ fontWeight: 500 }}>المقاعد المتاحة</span>
                                    <span style={{ color: course.available_seats > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                                        {course.available_seats} / {course.total_seats} متاح
                                    </span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${(course.available_seats / course.total_seats) * 100}%`,
                                            backgroundColor: course.available_seats > 0 ? 'var(--color-success)' : 'var(--color-error)',
                                            transition: 'width var(--transition-base)',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                        لم يتم العثور على دورات. أنشئ دورتك الأولى للبدء.
                    </p>
                    <a href="/admin/dashboard/courses/new" className="btn btn-primary">
                        + إضافة الدورة الأولى
                    </a>
                </div>
            )}
        </div>
    )
}

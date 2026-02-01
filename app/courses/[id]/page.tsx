import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

import RegistrationForm from '@/components/RegistrationForm'

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .eq('is_active', true)
        .single()

    if (error || !course) {
        notFound()
    }

    // Get registration form for this course
    const { data: form } = await supabase
        .from('registration_forms')
        .select('id, title')
        .eq('course_id', course.id)
        .eq('is_active', true)
        .single()

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-xl) 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="card">
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h1 style={{ marginBottom: 'var(--spacing-md)' }}>{course.title}</h1>
                        {course.description && (
                            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
                                {course.description}
                            </p>
                        )}
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 'var(--spacing-lg)',
                            marginBottom: 'var(--spacing-xl)',
                            padding: 'var(--spacing-lg)',
                            backgroundColor: 'var(--color-background)',
                            borderRadius: 'var(--radius-md)',
                        }}
                    >
                        {course.instructor && (
                            <div>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                                    المحاضر
                                </p>
                                <p style={{ fontWeight: 600 }}>{course.instructor}</p>
                            </div>
                        )}
                        {course.start_date && (
                            <div>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                                    تاريخ البدء
                                </p>
                                <p style={{ fontWeight: 600 }}>{new Date(course.start_date).toLocaleDateString('ar-SA')}</p>
                            </div>
                        )}
                        {course.end_date && (
                            <div>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                                    تاريخ الانتهاء
                                </p>
                                <p style={{ fontWeight: 600 }}>{new Date(course.end_date).toLocaleDateString('ar-SA')}</p>
                            </div>
                        )}
                        {course.price > 0 && (
                            <div>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                                    السعر
                                </p>
                                <p style={{ fontWeight: 600, fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)' }}>
                                    {course.price} ريال
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Seat Availability */}
                    <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <h3>المقاعد المتاحة</h3>
                            <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: course.available_seats > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                                {course.available_seats} / {course.total_seats}
                            </span>
                        </div>
                        <div style={{ height: '12px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
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

                    {/* Registration Section */}
                    <div id="register" style={{ marginTop: 'var(--spacing-2xl)', paddingTop: 'var(--spacing-xl)', borderTop: '1px solid var(--color-border)' }}>
                        <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>التسجيل في الدورة</h2>

                        {form ? (
                            <RegistrationForm
                                formId={form.id}
                                courseId={course.id}
                                courseTitle={course.title}
                                availableSeats={course.available_seats}
                                totalSeats={course.total_seats}
                            />
                        ) : (
                            <div className="alert alert-warning">
                                نعتذر، التسجيل في هذه الدورة غير متاح حالياً (لم يتم إعداد نموذج التسجيل).
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                    <a href="/courses" style={{ color: 'var(--color-text-secondary)' }}>
                        ← العودة لجميع الدورات
                    </a>
                </div>
            </div>
        </div>
    )
}

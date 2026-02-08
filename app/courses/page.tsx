import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

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
                            <Link href={`/courses/${course.id}`} key={course.id} className="card hover-scale fade-in group" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
                                {/* Banner Image */}
                                <div style={{ height: '200px', backgroundColor: 'var(--color-surface)', position: 'relative', overflow: 'hidden' }}>
                                    {course.banner_url ? (
                                        <img
                                            src={course.banner_url}
                                            alt={course.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            className="group-hover:scale-105"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--grad-navy)', color: 'white', opacity: 0.8 }}>
                                            <BookOpen size={48} opacity={0.5} />
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                                        {course.is_happening_now && (
                                            <span style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }} className="animate-pulse">
                                                تقام الآن
                                            </span>
                                        )}
                                        {course.status === 'completed' && (
                                            <span style={{ backgroundColor: 'var(--color-text-muted)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                منتهية
                                            </span>
                                        )}
                                    </div>
                                    {/* Price Badge */}
                                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '4px 12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: 'var(--color-navy)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        {course.price > 0 ? `${course.price} ريال` : 'مجاني'}
                                    </div>
                                </div>

                                <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)' }}>{course.title}</h3>

                                    {course.description && (
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: '1.6', height: '3.2em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: 'var(--spacing-md)' }}>
                                            {course.description}
                                        </p>
                                    )}

                                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                        {course.instructor && (
                                            <div style={{ fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>👨‍🏫</span>
                                                <span style={{ fontWeight: 500 }}>{course.instructor}</span>
                                            </div>
                                        )}
                                        {course.start_date && (
                                            <div style={{ fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                                <span style={{ color: 'var(--color-text-muted)' }}>📅</span>
                                                <span style={{ fontWeight: 500 }}>{new Date(course.start_date).toLocaleDateString('ar-SA')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
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

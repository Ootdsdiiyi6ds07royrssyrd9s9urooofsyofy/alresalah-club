'use client'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Megaphone, Image as ImageIcon, BookOpen, GraduationCap, Star, CheckCircle } from 'lucide-react'

export default function HomePage() {
    const supabase = createClient()
    const [stats, setStats] = useState({ available: 0, completed: 0 })
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [featuredCourses, setFeaturedCourses] = useState<any[]>([])
    const [smartLearner, setSmartLearner] = useState<any>({
        name: 'عبدالله بن محمد',
        title: 'متعلم متميز',
        cohort: 'دفعة 2025',
        description: 'نكرم في كل عام الطالب الأكثر تميزاً ومشاركة في برامجنا التدريبية. الطالب الذي أثبت جدارته بالتفوق والابتكار.'
    })

    useEffect(() => {
        const fetchData = async () => {
            const now = new Date().toISOString()
            const [
                availableResult,
                completedResult,
                announcementsRes,
                featuredRes,
                smartRes
            ] = await Promise.all([
                supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_active', true).gt('available_seats', 0),
                supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_active', true).lt('end_date', now),
                supabase.from('announcements').select('*').eq('is_active', true).lte('publish_date', now).order('publish_date', { ascending: false }).limit(3),
                supabase.from('courses').select('*').eq('is_active', true).gt('available_seats', 0).order('created_at', { ascending: false }).limit(4),
                supabase.from('site_settings').select('value').eq('id', 'smart_learner').single()
            ])

            setStats({
                available: availableResult.count || 0,
                completed: completedResult.count || 0
            })
            if (announcementsRes.data) setAnnouncements(announcementsRes.data)
            if (featuredRes.data) setFeaturedCourses(featuredRes.data)
            if (smartRes.data?.value) setSmartLearner(smartRes.data.value)
        }
        fetchData()
    }, [])

    return (
        <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section
                style={{
                    background: 'var(--grad-navy)',
                    color: 'white',
                    padding: 'var(--spacing-2xl) 0',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h2 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: 'var(--spacing-lg)', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                        نادي الرسالة التعليمي
                    </h2>
                    <p className="hero-subtitle" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', marginBottom: 'var(--spacing-2xl)', opacity: 0.9, maxWidth: '800px', margin: '0 auto var(--spacing-2xl)' }}>
                        بوابتك نحو التميز والإبداع في رحلتك التعليمية. نقدم لك برامج تدريبية متكاملة تهدف إلى تطوير مهاراتك وبناء مستقبلك.
                    </p>

                    {/* Quick Access Buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: 'var(--spacing-md)',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <QuickButton href="/announcements" icon={<Megaphone size={28} />} label="الإعلانات" color="#3b82f6" />
                        <QuickButton href="/gallery" icon={<ImageIcon size={28} />} label="المعرض" color="#10b981" />
                        <QuickButton href="/courses" icon={<BookOpen size={28} />} label="الدورات" color="#f59e0b" />
                        <QuickButton href="/programs" icon={<GraduationCap size={28} />} label="البرامج" color="#8b5cf6" />
                    </div>
                </div>

                {/* Decorative background element */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-10%',
                    width: 'min(600px, 100vw)',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: 1
                }} />
            </section>

            {/* Statistics & Counters Section */}
            <section style={{ padding: 'var(--spacing-2xl) 0', background: 'var(--color-surface)', marginTop: '-40px' }}>
                <div className="container flex-responsive" style={{
                    justifyContent: 'center',
                    gap: 'var(--spacing-2xl)'
                }}>
                    <StatBox count={stats.available} label="دورات متاحة حالياً" icon={<Star size={32} />} color="var(--color-primary)" />
                    <StatBox count={stats.completed} label="دورات تم إنجازها" icon={<CheckCircle size={32} />} color="var(--color-success)" />
                </div>
            </section>

            {/* Smart Learner of the Year Section */}
            <section style={{ padding: 'var(--spacing-2xl) 0' }}>
                <div className="container">
                    <div className="card flex-responsive" style={{
                        background: 'linear-gradient(135deg, var(--color-beige) 0%, #fff 100%)',
                        border: '2px solid var(--color-gold)',
                        alignItems: 'center',
                        gap: 'var(--spacing-2xl)',
                        padding: 'var(--spacing-2xl)'
                    }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <span className="badge badge-warning" style={{ marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-sm) var(--spacing-lg)' }}>
                                لقب العام 🏆
                            </span>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-navy)' }}>
                                الفائز بلقب المتعلم الذكي
                            </h2>
                            <p style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: 'var(--spacing-xl)' }}>
                                {smartLearner.description}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-gold)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '2rem',
                                    color: 'white'
                                }}>
                                    <GraduationCap size={40} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{smartLearner.name}</h3>
                                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{smartLearner.title} - {smartLearner.cohort}</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
                            <div style={{
                                position: 'relative',
                                display: 'inline-block',
                                padding: 'var(--spacing-xl)',
                                border: '4px dashed var(--color-gold)',
                                borderRadius: 'var(--radius-xl)'
                            }}>
                                <span style={{ fontSize: '8rem', color: 'var(--color-gold)' }}>💎</span>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-20px',
                                    right: '-20px',
                                    background: 'var(--color-navy)',
                                    color: 'white',
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 'bold'
                                }}>الذكي 2026</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Announcements Section */}
            <section style={{ padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-background)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)', gap: 'var(--spacing-md)' }}>
                        <h2 style={{ margin: 0 }}>أحدث الإعلانات</h2>
                        <Link href="/announcements" className="nav-link" style={{ whiteSpace: 'nowrap' }}>عرض الكل ←</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {announcements.map((ann: any) => (
                            <div key={ann.id} className="card hover-scale" style={{ borderTop: `4px solid ${ann.priority === 'urgent' ? 'var(--color-error)' : 'var(--color-primary)'}` }}>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                    {new Date(ann.publish_date).toLocaleDateString('ar-SA')}
                                </span>
                                <h3 style={{ marginTop: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>{ann.title}</h3>
                                <p style={{ color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {ann.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Section (Programs/Courses) */}
            <section style={{ padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-surface)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>انطلق معنا في رحلتك القادمة</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-xl)' }}>
                        {featuredCourses.map((course: any) => (
                            <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ height: '8px', background: 'var(--grad-gold)', margin: '-var(--spacing-lg) -var(--spacing-lg) var(--spacing-md)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
                                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{course.title}</h3>
                                <p style={{ flex: 1, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-lg)' }}>
                                    {course.description || 'تعلم واكتسب مهارات جديدة مع نخبة من الخبراء في هذا المجال.'}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>{course.price > 0 ? `${course.price} ريال` : 'مجاني'}</span>
                                    <Link href={`/courses/${course.id}`} className="btn btn-secondary btn-sm">سجل الآن</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'var(--color-navy)', color: 'white', padding: 'var(--spacing-2xl) 0', marginTop: 'var(--spacing-2xl)' }}>
                <div className="container">
                    <div className="flex-responsive" style={{ justifyContent: 'space-between', gap: 'var(--spacing-2xl)' }}>
                        <div style={{ maxWidth: '400px' }}>
                            <h2 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>نادي الرسالة</h2>
                            <p style={{ opacity: 0.7 }}>نحن نهتم ببناء جيل مبدع، ملهم، وقادر على قيادة المستقبل من خلال برامج تعليمية نوعية.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-2xl)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                <h4 style={{ color: 'var(--color-gold)' }}>روابط هامة</h4>
                                <Link href="/courses" style={{ color: 'white', opacity: 0.8 }}>الدورات</Link>
                                <Link href="/programs" style={{ color: 'white', opacity: 0.8 }}>البرامج</Link>
                                <Link href="/gallery" style={{ color: 'white', opacity: 0.8 }}>المعرض</Link>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'var(--spacing-2xl)', paddingTop: 'var(--spacing-xl)', textAlign: 'center', opacity: 0.5 }}>
                        © 2026 جميع الحقوق محفوظة لنادي الرسالة التعليمي
                    </div>
                </div>
            </footer>

        </div>
    )
}

function QuickButton({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div className="card hover-scale" style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-xs)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    color: 'white'
                }}>{icon}</div>
                <span style={{ color: 'white', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{label}</span>
            </div>
        </Link>
    )
}

function StatBox({ count, label, icon, color }: { count: number; label: string; icon: React.ReactNode; color: string }) {
    return (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', minWidth: '200px' }}>
            <div style={{ color: color, marginBottom: 'var(--spacing-xs)', display: 'inline-flex' }}>{icon}</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontWeight: 500, marginTop: 'var(--spacing-xs)' }}>{label}</div>
        </div>
    )
}

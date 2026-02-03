import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, MapPin, Clock, Tag, CreditCard, Users, ArrowRight } from 'lucide-react'

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { data: program, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', params.id)
        .eq('is_active', true)
        .single()

    if (error || !program) {
        notFound()
    }

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-2xl) 0', background: 'var(--color-background)' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <Link href="/programs" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', width: 'fit-content' }}>
                        <ArrowRight size={16} /> العودة للبرامج
                    </Link>
                </div>

                <div className="card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
                    {program.image_url ? (
                        <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                            <img src={program.image_url} alt={program.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
                            <h1 style={{ position: 'absolute', bottom: 'var(--spacing-xl)', right: 'var(--spacing-xl)', color: 'white', margin: 0 }}>{program.title}</h1>
                        </div>
                    ) : (
                        <div style={{ padding: 'var(--spacing-2xl)', background: 'var(--grad-navy)', color: 'white' }}>
                            <h1 style={{ margin: 0, fontSize: 'var(--font-size-3xl)' }}>{program.title}</h1>
                            <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                                <span className="badge badge-primary">{program.category || 'عام'}</span>
                            </div>
                        </div>
                    )}

                    <div style={{ padding: 'var(--spacing-2xl)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-2xl)' }}>
                            <InfoItem icon={<User size={20} />} label="المحاضر / المسؤول" value={program.instructor} />
                            <InfoItem icon={<Clock size={20} />} label="المدة" value={program.duration} />
                            <InfoItem icon={<Calendar size={20} />} label="تاريخ البدء" value={program.start_date ? new Date(program.start_date).toLocaleDateString('ar-SA') : 'سيحدد لاحقاً'} />
                            <InfoItem icon={<MapPin size={20} />} label="الموقع" value={program.location} />
                            <InfoItem icon={<CreditCard size={20} />} label="السعر" value={program.price > 0 ? `${program.price} ريال` : 'مجاني'} />
                            <InfoItem icon={<Users size={20} />} label="المقاعد المتاحة" value={program.total_seats > 0 ? `${program.available_seats} / ${program.total_seats}` : 'غير محدود'} />
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-xl)' }}>
                            <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-navy)' }}>عن البرنامج</h2>
                            <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>
                                {program.description}
                            </div>
                        </div>

                        <div style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
                            <button className="btn btn-primary btn-lg" style={{ minWidth: '200px' }}>
                                التسجيل في البرنامج قريباً
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: any }) {
    if (!value && value !== 0) return null
    return (
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
            <div style={{ padding: '10px', background: 'var(--color-beige)', borderRadius: 'var(--radius-md)', color: 'var(--color-navy)' }}>
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{label}</p>
                <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-navy)' }}>{value}</p>
            </div>
        </div>
    )
}

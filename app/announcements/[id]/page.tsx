import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, AlertCircle, ArrowRight } from 'lucide-react'

export default async function AnnouncementDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { data: announcement, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', params.id)
        .eq('is_active', true)
        .single()

    if (error || !announcement) {
        notFound()
    }

    const isUrgent = announcement.priority === 'urgent'
    const isHigh = announcement.priority === 'high'

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-background)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <Link href="/announcements" style={{
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: 'fit-content'
                    }}>
                        <ArrowRight size={18} /> العودة للإعلانات
                    </Link>
                </div>

                <div className="card" style={{ borderTop: `6px solid ${isUrgent ? 'var(--color-error)' : isHigh ? 'var(--color-warning)' : 'var(--color-primary)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                        <h1 style={{ margin: 0, fontSize: '2rem', flex: 1 }}>{announcement.title}</h1>
                        <span className={`badge badge-${isUrgent ? 'error' : isHigh ? 'warning' : 'primary'}`} style={{ padding: '6px 16px', fontSize: '0.9rem' }}>
                            {isUrgent ? 'عاجل جداً' : isHigh ? 'هام' : 'إعلان عام'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} />
                            {new Date(announcement.publish_date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                        {announcement.content}
                    </div>

                    {announcement.expiration_date && (
                        <div style={{ marginTop: 'var(--spacing-2xl)', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <AlertCircle size={20} color="var(--color-warning)" />
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                ينتهي هذا الإعلان في {new Date(announcement.expiration_date).toLocaleDateString('ar-SA')}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

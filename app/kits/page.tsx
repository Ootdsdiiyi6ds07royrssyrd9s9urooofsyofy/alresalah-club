
import { createClient as createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Download, Book } from 'lucide-react';

export default async function PublicKitsPage() {
    const supabase = await createServerClient();
    const { data: kits } = await supabase
        .from('educational_kits')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    return (
        <div style={{ padding: 'var(--spacing-2xl) 0', minHeight: '80vh', background: 'var(--color-background)' }}>
            <div className="container">
                {/* Back Link */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <a href="/" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', width: 'fit-content' }}>
                        <span>←</span> العودة للرئيسية
                    </a>
                </div>

                {/* Page Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 className="gradient-text" style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-sm)' }}>الحقائب التعليمية</h1>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        مجموعة من المصادر والمراجع التعليمية الموثوقة لدعم رحلتك التعليمية
                    </p>
                </div>

                {kits && kits.length > 0 ? (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: 'var(--spacing-xl)',
                        }}
                    >
                        {kits.map((kit) => (
                            <div key={kit.id} className="card hover-scale fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
                                {/* Banner/Cover Image */}
                                <div style={{ height: '200px', backgroundColor: 'var(--color-surface)', position: 'relative', overflow: 'hidden' }}>
                                    {kit.cover_url ? (
                                        <img
                                            src={kit.cover_url}
                                            alt={kit.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--grad-navy)', color: 'white', opacity: 0.8 }}>
                                            <Book size={48} opacity={0.5} />
                                        </div>
                                    )}
                                </div>

                                {/* Kit Info */}
                                <div style={{ padding: 'var(--spacing-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                                        {kit.title}
                                    </h3>

                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-lg)', flex: 1, lineClamp: 3 }}>
                                        {kit.description}
                                    </p>

                                    <div style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                                        <a
                                            href={kit.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                            style={{ width: '100%' }}
                                        >
                                            <Download size={18} />
                                            تحميل الحقيبة
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📚</div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>لا توجد حقائب تعليمية متاحة حالياً</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>سنقوم بإضافة المزيد من الموارد التعليمية قريباً.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

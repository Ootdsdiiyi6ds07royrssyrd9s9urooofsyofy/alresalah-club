
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Download, Edit2, Eye, Book } from 'lucide-react';

export default async function KitsPage() {
    const supabase = await createClient();
    const { data: kits } = await supabase.from('educational_kits').select('*').order('created_at', { ascending: false });

    return (
        <div style={{ spaceY: 'var(--spacing-lg)' }}>
            {/* Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-text)' }}>الحقائب التعليمية</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>إدارة الموارد والملفات التعليمية المتاحة للطلاب</p>
                </div>

                <Link
                    href="/admin/dashboard/kits/new"
                    className="btn btn-primary"
                >
                    <Plus size={18} />
                    <span>إضافة حقيبة جديدة</span>
                </Link>
            </div>

            {/* Grid Area */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 'var(--spacing-xl)'
            }}>
                {kits?.map((kit) => (
                    <div key={kit.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {/* Status Ribbon */}
                        <div style={{
                            position: 'absolute',
                            top: 'var(--spacing-sm)',
                            right: 'var(--spacing-sm)',
                            zIndex: 10
                        }}>
                            <span className={`badge badge-${kit.is_active ? 'success' : 'error'}`} style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
                                {kit.is_active ? 'نشط' : 'غير نشط'}
                            </span>
                        </div>

                        {/* Banner/Cover */}
                        <div style={{ height: '160px', background: 'var(--color-surface-elevated)', position: 'relative' }}>
                            {kit.cover_url ? (
                                <img
                                    src={kit.cover_url}
                                    alt={kit.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--grad-navy)',
                                    color: 'white',
                                    opacity: 0.8
                                }}>
                                    <Book size={40} opacity={0.5} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div style={{ padding: 'var(--spacing-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>
                                {kit.title}
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)', flex: 1, lineClamp: 2 }}>
                                {kit.description}
                            </p>

                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                                <a
                                    href={kit.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary btn-sm"
                                    style={{ flex: 1 }}
                                    title="معاينة الملف"
                                >
                                    <Eye size={16} />
                                </a>
                                <Link
                                    href={`/admin/dashboard/kits/${kit.id}/edit`}
                                    className="btn btn-secondary btn-sm"
                                    style={{ flex: 1 }}
                                    title="تعديل"
                                >
                                    <Edit2 size={16} />
                                </Link>
                                <a
                                    href={kit.file_url}
                                    download
                                    className="btn btn-primary btn-sm"
                                    style={{ flex: 1 }}
                                    title="تحميل"
                                >
                                    <Download size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}

                {(!kits || kits.length === 0) && (
                    <div colSpan={3} className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
                        <Book size={48} style={{ margin: '0 auto var(--spacing-md)', color: 'var(--color-text-muted)', opacity: 0.5 }} />
                        <h3 style={{ color: 'var(--color-text)', marginBottom: 'var(--spacing-sm)' }}>لا توجد حقائب تعليمية</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>ابدأ بإضافة أول حقيبة تعليمية للنادي</p>
                    </div>
                )}
            </div>
        </div>
    );
}

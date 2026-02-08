
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Mail, Phone, Search, User as UserIcon, Calendar } from 'lucide-react';

export default async function StudentListPage({ searchParams }: { searchParams: { q?: string } }) {
    const supabase = await createClient();
    const query = searchParams.q || '';

    let studentQuery = supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

    if (query) {
        studentQuery = studentQuery.ilike('name', `%${query}%`);
    }

    const { data: students } = await studentQuery;

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
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-text)' }}>كشفيات الطلاب</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>إدارة واستعراض بيانات الطلاب المسجلين</p>
                </div>

                {/* Search Box */}
                <form style={{ position: 'relative', width: '300px' }}>
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            right: 'var(--spacing-sm)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)'
                        }}
                    />
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="بحث عن طالب..."
                        className="input"
                        style={{ paddingRight: 'var(--spacing-xl)' }}
                    />
                </form>
            </div>

            {/* Table Area */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-surface-elevated)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>الطالب</th>
                                <th style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>بيانات التواصل</th>
                                <th style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>تاريخ التسجيل</th>
                                <th style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>الحالة</th>
                            </tr>
                        </thead>
                        <tbody style={{ divideY: '1px solid var(--color-border)' }}>
                            {students?.map((student) => (
                                <tr key={student.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background var(--transition-fast)' }} className="hover-bg-surface">
                                    <td style={{ padding: 'var(--spacing-lg)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                            {student.avatar_url ? (
                                                <img
                                                    src={student.avatar_url}
                                                    alt={student.name}
                                                    style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    borderRadius: '50%',
                                                    background: 'var(--grad-navy)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white'
                                                }}>
                                                    <UserIcon size={20} />
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{student.name}</div>
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>ID: {student.bawaba_id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-lg)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                            {student.email && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                    <Mail size={14} /> {student.email}
                                                </div>
                                            )}
                                            {student.phone && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                    <Phone size={14} /> <span dir="ltr">{student.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-lg)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            <Calendar size={14} />
                                            {new Date(student.created_at).toLocaleDateString('ar-SA')}
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                                        <span className="badge badge-success">نشط</span>
                                    </td>
                                </tr>
                            ))}
                            {(!students || students.length === 0) && (
                                <tr>
                                    <td colSpan={4} style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        لا يوجد طلاب مطابقين للبحث
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .hover-bg-surface:hover {
                    background-color: var(--color-surface-elevated);
                }
            `}</style>
        </div>
    );
}

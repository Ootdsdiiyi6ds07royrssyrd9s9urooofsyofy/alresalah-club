import { createClient } from '@/lib/supabase/server'

export default async function ActivityLogsPage() {
    const supabase = await createClient()

    const { data: logs } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>سجل الأنشطة</h1>

            {logs && logs.length > 0 ? (
                <div className="card">
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>الوقت والتاريخ</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>النشاط</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>نوع الكيان</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>التفاصيل</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
                                            {new Date(log.created_at).toLocaleString('ar-SA')}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <span className={`badge badge-${getActionBadgeColor(log.action_type)}`}>
                                                {translateAction(log.action_type)}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
                                            {translateEntity(log.entity_type) || '-'}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            {log.details ? JSON.stringify(log.details).substring(0, 50) + '...' : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>لم يتم العثور على سجلات أنشطة</p>
                </div>
            )}
        </div>
    )
}

function translateAction(action: string): string {
    const translations: Record<string, string> = {
        'create': 'إضافة',
        'update': 'تعديل',
        'delete': 'حذف',
        'login': 'تسجيل دخول',
    }
    return translations[action.toLowerCase()] || action
}

function translateEntity(entity: string | null): string | null {
    if (!entity) return null
    const translations: Record<string, string> = {
        'course': 'دورة',
        'form': 'نموذج',
        'applicant': 'متقدم',
        'survey': 'استبيان',
    }
    return translations[entity.toLowerCase()] || entity
}

function getActionBadgeColor(action: string): string {
    switch (action.toLowerCase()) {
        case 'create':
            return 'success'
        case 'update':
            return 'primary'
        case 'delete':
            return 'error'
        case 'login':
            return 'primary'
        default:
            return 'primary'
    }
}

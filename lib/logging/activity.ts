export interface ActivityLogData {
    action_type: string
    entity_type?: string
    entity_id?: string
    details?: Record<string, any>
}

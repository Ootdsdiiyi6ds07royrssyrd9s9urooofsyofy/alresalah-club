export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            students: {
                Row: {
                    id: string
                    name: string
                    email: string
                    phone: string | null
                    national_id: string | null
                    bawaba_id: string | null
                    password_hash: string | null
                    bio: string | null
                    specialization: string | null
                    interests: Json | null
                    birth_date: string | null
                    avatar_url: string | null
                    status: string
                    is_approved: boolean | null
                    verification_code: string | null
                    code_expiry: string | null
                    created_at: string
                    last_login: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    phone?: string | null
                    national_id?: string | null
                    bawaba_id?: string | null
                    password_hash?: string | null
                    bio?: string | null
                    specialization?: string | null
                    interests?: Json | null
                    birth_date?: string | null
                    avatar_url?: string | null
                    status?: string
                    is_approved?: boolean | null
                    verification_code?: string | null
                    code_expiry?: string | null
                    created_at?: string
                    last_login?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    national_id?: string | null
                    bawaba_id?: string | null
                    password_hash?: string | null
                    bio?: string | null
                    specialization?: string | null
                    interests?: Json | null
                    birth_date?: string | null
                    avatar_url?: string | null
                    status?: string
                    is_approved?: boolean | null
                    verification_code?: string | null
                    code_expiry?: string | null
                    created_at?: string
                    last_login?: string | null
                }
            }
            courses: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    instructor: string | null
                    start_date: string | null
                    end_date: string | null
                    total_seats: number
                    available_seats: number
                    price: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    instructor?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    total_seats: number
                    available_seats?: number
                    price?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    instructor?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    total_seats?: number
                    available_seats?: number
                    price?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            programs: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    duration: string | null
                    category: string | null
                    image_url: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    duration?: string | null
                    category?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    duration?: string | null
                    category?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            registration_forms: {
                Row: {
                    id: string
                    course_id: string | null
                    title: string
                    description: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    course_id?: string | null
                    title: string
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    course_id?: string | null
                    title?: string
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            form_fields: {
                Row: {
                    id: string
                    form_id: string
                    field_name: string
                    field_label: string
                    field_type: string
                    is_required: boolean
                    options: Json | null
                    validation_rules: Json | null
                    placeholder: string | null
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    form_id: string
                    field_name: string
                    field_label: string
                    field_type: string
                    is_required?: boolean
                    options?: Json | null
                    validation_rules?: Json | null
                    placeholder?: string | null
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    form_id?: string
                    field_name?: string
                    field_label?: string
                    field_type?: string
                    is_required?: boolean
                    options?: Json | null
                    validation_rules?: Json | null
                    placeholder?: string | null
                    display_order?: number
                    created_at?: string
                }
            }
            applicants: {
                Row: {
                    id: string
                    form_id: string
                    course_id: string
                    full_name: string
                    email: string
                    phone: string
                    form_responses: Json
                    registration_date: string
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    form_id: string
                    course_id: string
                    full_name: string
                    email: string
                    phone: string
                    form_responses: Json
                    registration_date?: string
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    form_id?: string
                    course_id?: string
                    full_name?: string
                    email?: string
                    phone?: string
                    form_responses?: Json
                    registration_date?: string
                    status?: string
                    created_at?: string
                }
            }
            surveys: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    course_id: string | null
                    is_active: boolean
                    start_date: string | null
                    end_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    course_id?: string | null
                    is_active?: boolean
                    start_date?: string | null
                    end_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    course_id?: string | null
                    is_active?: boolean
                    start_date?: string | null
                    end_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            survey_questions: {
                Row: {
                    id: string
                    survey_id: string
                    question_text: string
                    question_type: string
                    options: Json | null
                    is_required: boolean
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    survey_id: string
                    question_text: string
                    question_type: string
                    options?: Json | null
                    is_required?: boolean
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    survey_id?: string
                    question_text?: string
                    question_type?: string
                    options?: Json | null
                    is_required?: boolean
                    display_order?: number
                    created_at?: string
                }
            }
            survey_responses: {
                Row: {
                    id: string
                    survey_id: string
                    respondent_email: string | null
                    responses: Json
                    submitted_at: string
                }
                Insert: {
                    id?: string
                    survey_id: string
                    respondent_email?: string | null
                    responses: Json
                    submitted_at?: string
                }
                Update: {
                    id?: string
                    survey_id?: string
                    respondent_email?: string | null
                    responses?: Json
                    submitted_at?: string
                }
            }
            announcements: {
                Row: {
                    id: string
                    title: string
                    content: string
                    priority: string
                    publish_date: string
                    expiration_date: string | null
                    is_active: boolean
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    content: string
                    priority?: string
                    publish_date?: string
                    expiration_date?: string | null
                    is_active?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    content?: string
                    priority?: string
                    publish_date?: string
                    expiration_date?: string | null
                    is_active?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            media_gallery: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    media_type: string
                    file_url: string
                    thumbnail_url: string | null
                    category: string | null
                    uploaded_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    media_type: string
                    file_url: string
                    thumbnail_url?: string | null
                    category?: string | null
                    uploaded_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    media_type?: string
                    file_url?: string
                    thumbnail_url?: string | null
                    category?: string | null
                    uploaded_by?: string | null
                    created_at?: string
                }
            }
            activity_logs: {
                Row: {
                    id: string
                    user_id: string
                    action_type: string
                    entity_type: string | null
                    entity_id: string | null
                    details: Json | null
                    ip_address: string | null
                    user_agent: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    action_type: string
                    entity_type?: string | null
                    entity_id?: string | null
                    details?: Json | null
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    action_type?: string
                    entity_type?: string | null
                    entity_id?: string | null
                    details?: Json | null
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
            }
            shareable_links: {
                Row: {
                    id: string
                    entity_type: string
                    entity_id: string
                    short_code: string
                    full_url: string
                    view_count: number
                    created_by: string | null
                    expires_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    entity_type: string
                    entity_id: string
                    short_code: string
                    full_url: string
                    view_count?: number
                    created_by?: string | null
                    expires_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    entity_type?: string
                    entity_id?: string
                    short_code?: string
                    full_url?: string
                    view_count?: number
                    created_by?: string | null
                    expires_at?: string | null
                    created_at?: string
                }
            }
        }
    }
}

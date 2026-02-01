import { z } from 'zod'

// Email validation
export const emailSchema = z.string().email('Invalid email address')

// Saudi phone number validation (05XXXXXXXX or +9665XXXXXXXX)
export const phoneSchema = z.string().regex(
    /^(05\d{8}|(\+9665)\d{8})$/,
    'Invalid Saudi phone number. Format: 05XXXXXXXX'
)

// Name validation
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100)

// Text validation with sanitization
export const textSchema = z.string().min(1).max(1000)

// URL validation
export const urlSchema = z.string().url('Invalid URL')

// Date validation
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')

// Registration form validation
export const registrationSchema = z.object({
    full_name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    form_responses: z.record(z.any()),
})

// Survey response validation
export const surveyResponseSchema = z.object({
    survey_id: z.string().uuid(),
    respondent_email: emailSchema.optional(),
    responses: z.record(z.any()),
})

// Course creation validation
export const courseSchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().max(2000).optional(),
    instructor: z.string().max(255).optional(),
    start_date: dateSchema.optional(),
    end_date: dateSchema.optional(),
    total_seats: z.number().int().min(1).max(1000),
    price: z.number().min(0).optional(),
    is_active: z.boolean().optional(),
})

// Announcement validation
export const announcementSchema = z.object({
    title: z.string().min(3).max(255),
    content: z.string().min(10).max(5000),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
    publish_date: z.string().optional(),
    expiration_date: z.string().optional(),
    is_active: z.boolean().optional(),
})

// Survey creation validation
export const surveySchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().max(2000).optional(),
    course_id: z.string().uuid().optional(),
    is_active: z.boolean().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
})

// Media upload validation
export const mediaSchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().max(1000).optional(),
    media_type: z.enum(['image', 'video']),
    category: z.enum(['events', 'courses', 'general']).optional(),
})

// File upload validation
export const fileUploadSchema = z.object({
    file: z.instanceof(File),
    maxSize: z.number().optional(),
    allowedTypes: z.array(z.string()).optional(),
})

export function validateFileUpload(
    file: File,
    maxSize: number = 10 * 1024 * 1024, // 10MB default
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
): { valid: boolean; error?: string } {
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
        }
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File type must be one of: ${allowedTypes.join(', ')}`,
        }
    }

    return { valid: true }
}

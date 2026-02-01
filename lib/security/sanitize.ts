// Sanitize HTML to prevent XSS attacks
export function sanitizeHtml(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
}

// Sanitize text input
export function sanitizeText(input: string): string {
    return input.trim().replace(/\s+/g, ' ')
}

// Sanitize email
export function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
}

// Sanitize phone number (remove spaces, dashes, etc.)
export function sanitizePhone(phone: string): string {
    return phone.replace(/[\s\-\(\)]/g, '')
}

// Sanitize URL
export function sanitizeUrl(url: string): string {
    try {
        const parsed = new URL(url)
        // Only allow http and https protocols
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            throw new Error('Invalid protocol')
        }
        return parsed.toString()
    } catch {
        return ''
    }
}

// Sanitize object (recursively sanitize all string values)
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeText(value)
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[key] = sanitizeObject(value)
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'string' ? sanitizeText(item) :
                    typeof item === 'object' && item !== null ? sanitizeObject(item) :
                        item
            )
        } else {
            sanitized[key] = value
        }
    }

    return sanitized
}

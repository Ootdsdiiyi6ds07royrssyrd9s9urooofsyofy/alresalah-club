export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export class ValidationError extends AppError {
    constructor(message: string, public fields?: Record<string, string>) {
        super(message, 400, 'VALIDATION_ERROR')
        this.name = 'ValidationError'
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 401, 'AUTHENTICATION_ERROR')
        this.name = 'AuthenticationError'
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 403, 'AUTHORIZATION_ERROR')
        this.name = 'AuthorizationError'
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, 'NOT_FOUND_ERROR')
        this.name = 'NotFoundError'
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT_ERROR')
        this.name = 'ConflictError'
    }
}

export function handleError(error: unknown): { message: string; code?: string } {
    if (error instanceof AppError) {
        return {
            message: error.message,
            code: error.code,
        }
    }

    if (error instanceof Error) {
        return {
            message: error.message,
        }
    }

    return {
        message: 'An unexpected error occurred',
    }
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    return 'An unexpected error occurred'
}

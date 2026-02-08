
import { updateSession } from '@/lib/supabase/middleware'
import { getStudentSession } from '@/lib/auth/student-session'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Handle Admin/Supabase Session
    const { response, user } = await updateSession(request)

    const pathname = request.nextUrl.pathname;

    // 2. Protect admin routes
    if (pathname.startsWith('/admin')) {
        // Skip login page
        if (pathname === '/admin/login') {
            if (user) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
            return response
        }

        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // 3. Protect student routes
    if (pathname.startsWith('/student') && pathname !== '/student/login') {
        const studentCookie = request.cookies.get('student_session');
        let isValid = false;

        if (studentCookie) {
            const { verifySessionToken } = await import('@/lib/auth/student-session');
            const payload = await verifySessionToken(studentCookie.value);
            if (payload) isValid = true;
        }

        if (!isValid) {
            return NextResponse.redirect(new URL('/student/login', request.url));
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

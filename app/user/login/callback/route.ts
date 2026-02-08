
import { exchangeBawabaCode, getBawabaUser } from '@/lib/auth/bawaba';
import { createStudentSession } from '@/lib/auth/student-session';
import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL(`/student/login?error=${error}`, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/student/login?error=no_code', request.url));
    }

    try {
        // 1. Exchange code for tokens
        const tokens = await exchangeBawabaCode(code);

        // 2. Get User Info
        const user = await getBawabaUser(tokens.access_token);

        // 3. Sync with DB (Upsert Student)
        const supabase = createClient();

        // Map Bawaba user fields to our DB schema
        // Note: You might need to adjust user object property names based on actual Bawaba response
        const studentData = {
            bawaba_id: user.sub || user.id,
            name: user.name,
            email: user.email,
            phone: user.phone_number || user.phone,
            avatar_url: user.picture || user.avatar_url,
            last_login: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
            .from('students')
            .upsert(studentData, { onConflict: 'bawaba_id' });

        if (upsertError) {
            console.error('Error syncing student to DB:', upsertError);
            // Proceeding anyway as auth is successful
        }

        // 4. Create Session (Cookie)
        await createStudentSession(user);

        // 5. Redirect to Student Dashboard
        return NextResponse.redirect(new URL('/student/dashboard', request.url));
    } catch (err) {
        console.error('Bawaba Login Error:', err);
        return NextResponse.redirect(new URL('/student/login?error=auth_failed', request.url));
    }
}

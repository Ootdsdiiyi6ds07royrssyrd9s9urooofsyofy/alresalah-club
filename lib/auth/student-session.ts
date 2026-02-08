
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(process.env.BAWABA_APP_SECRET || 'default-secret-key-change-me');
const COOKIE_NAME = 'student_session';

export async function createStudentSession(user: any) {
    const token = await new SignJWT({ ...user })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // Session duration
        .sign(SECRET_KEY);

    cookies().set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

export async function verifySessionToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getStudentSession() {
    const cookie = cookies().get(COOKIE_NAME);
    if (!cookie) return null;
    return verifySessionToken(cookie.value);
}

export async function deleteStudentSession() {
    cookies().delete(COOKIE_NAME);
}

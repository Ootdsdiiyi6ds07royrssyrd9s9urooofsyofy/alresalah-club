
import { getBawabaAuthUrl } from '@/lib/auth/bawaba';
import { redirect } from 'next/navigation';

export async function GET() {
    const authUrl = getBawabaAuthUrl();
    redirect(authUrl);
}


import { deleteStudentSession } from '@/lib/auth/student-session';
import { redirect } from 'next/navigation';

export async function GET() {
    await deleteStudentSession();
    redirect('/student/login');
}

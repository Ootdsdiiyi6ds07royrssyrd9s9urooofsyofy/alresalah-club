import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { status, is_approved } = await request.json();

        // Verify admin (optional if middleware handles it, but good to add)
        // For now assuming middleware protection on /admin routes implies this API is protected too
        // or check session role here.

        const { error } = await supabase
            .from('students')
            .update({ status, is_approved })
            .eq('id', params.id);

        if (error) throw error;

        return NextResponse.json({ message: 'تم تحديث حالة الطالب بنجاح' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', params.id);

        if (error) throw error;

        return NextResponse.json({ message: 'تم حذف الطالب بنجاح' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

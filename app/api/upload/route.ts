
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'uploads';

        if (!file) {
            return NextResponse.json({ error: 'لم يتم توفير ملف' }, { status: 400 });
        }

        // 1. Ensure bucket exists (or just try to upload to 'al-resalah' bucket)
        const bucketName = 'al-resalah';
        
        // 2. Prepare file data
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // 3. Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // 4. Upload to Supabase Storage
        const { data, error: uploadError } = await supabaseAdmin.storage
            .from(bucketName)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error('Supabase Storage error:', uploadError);
            return NextResponse.json(
                { error: 'فشل رفع الصورة إلى التخزين السحابي' },
                { status: 500 }
            );
        }

        // 5. Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        return NextResponse.json({
            url: publicUrl,
            path: data.path,
        });
    } catch (error: any) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: 'حدث خطأ غير متوقع أثناء الرفع' },
            { status: 500 }
        );
    }
}

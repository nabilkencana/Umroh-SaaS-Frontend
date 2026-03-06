import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Upload file to Supabase Storage
export async function uploadFile(file: File, folder: string, filename: string) {
    const filePath = `${folder}/${filename}`;

    const { data, error } = await supabase.storage
        .from('jamaah-documents')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) {
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('jamaah-documents')
        .getPublicUrl(filePath);

    return publicUrl;
}

// Delete file from Supabase Storage
export async function deleteFile(filePath: string) {
    const { error } = await supabase.storage
        .from('jamaah-documents')
        .remove([filePath]);

    if (error) {
        throw error;
    }
}

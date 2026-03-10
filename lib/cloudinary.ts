// lib/cloudinary.ts
export async function uploadToCloudinary(
    file: File,
    folder: string,
    uploadPreset?: string
): Promise<string> {
    try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = uploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        // Validasi konfigurasi
        if (!cloudName) {
            throw new Error('CLOUDINARY_CLOUD_NAME is not configured');
        }
        if (!preset) {
            throw new Error('CLOUDINARY_UPLOAD_PRESET is not configured');
        }

        console.log('🔄 Uploading to Cloudinary...', {
            cloudName,
            preset,
            folder,
            fileName: file.name,
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset);
        formData.append('folder', `umroh-manager/${folder}`);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        // Log response untuk debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { error: { message: 'Failed to parse error response' } };
            }

            console.error('Cloudinary error details:', errorData);

            // Error spesifik untuk upload preset
            if (errorData.error?.message?.includes('preset')) {
                throw new Error('Upload preset tidak valid. Periksa konfigurasi Cloudinary Anda.');
            }

            throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Upload successful:', {
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
            size: `${(data.bytes / 1024 / 1024).toFixed(2)}MB`
        });

        return data.secure_url;
    } catch (error) {
        console.error('❌ Cloudinary upload failed:', error);
        throw error; // Throw error untuk dihandle di component
    }
}
// Cloudinary upload utility
export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Check if Cloudinary is configured
    if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name' || uploadPreset === 'your_upload_preset') {
        console.warn('Cloudinary not configured, skipping upload');
        return ''; // Return empty string if not configured
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `jamaah-documents/${folder}`);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudinary upload error:', errorData);

            // If preset error, just skip upload
            if (errorData.error?.message?.includes('preset')) {
                console.warn('Cloudinary preset not configured correctly, skipping upload');
                return '';
            }

            throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        // Don't throw error, just return empty string
        return '';
    }
}

// Delete file from Cloudinary (optional)
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    // This requires backend implementation with Cloudinary API secret
    console.log('Delete file:', publicId);
}

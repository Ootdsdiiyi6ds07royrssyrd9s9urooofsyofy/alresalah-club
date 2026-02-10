
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export default cloudinary;

export const uploadToCloudinary = async (
    fileUri: string,
    folder: string = 'al-resalah'
) => {
    try {
        const result = await cloudinary.uploader.upload(fileUri, {
            folder,
            resource_type: 'auto',
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

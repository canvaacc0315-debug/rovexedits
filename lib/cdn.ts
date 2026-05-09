import { v2 as cloudinary } from 'cloudinary';
import ImageKit from 'imagekit';

interface UploadResult {
  imageUrl: string;
  thumbUrl: string;
  provider: string; // e.g., 'cloudinary:valophp001' or 'imagekit:rovexik01'
  bytes: number;
}

export async function uploadImage(fileBuffer: Buffer, fileName: string): Promise<UploadResult> {
  const base64File = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
  
  // 1. Try Cloudinary #1
  if (process.env.CLOUDINARY1_API_KEY && process.env.CLOUDINARY1_API_SECRET) {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY1_CLOUD_NAME,
        api_key: process.env.CLOUDINARY1_API_KEY,
        api_secret: process.env.CLOUDINARY1_API_SECRET,
      });

      const res = await cloudinary.uploader.upload(base64File, {
        folder: 'rovexedits',
        public_id: fileName.replace(/\.[^/.]+$/, ""), // remove extension
        resource_type: 'image',
      });

      return {
        imageUrl: res.secure_url,
        // Generate a fast-loading thumbnail using Cloudinary transformations
        thumbUrl: cloudinary.url(res.public_id, { width: 600, crop: 'scale', format: 'webp', quality: 'auto' }),
        provider: `cloudinary:${process.env.CLOUDINARY1_CLOUD_NAME}`,
        bytes: res.bytes,
      };
    } catch (err) {
      console.error("Cloudinary #1 upload failed, falling back...", err);
    }
  }

  // 2. Try ImageKit #1 as fallback
  if (process.env.IK1_PUBLIC_KEY && process.env.IK1_PRIVATE_KEY && process.env.IK1_URL_ENDPOINT) {
    try {
      const imagekit = new ImageKit({
        publicKey: process.env.IK1_PUBLIC_KEY,
        privateKey: process.env.IK1_PRIVATE_KEY,
        urlEndpoint: process.env.IK1_URL_ENDPOINT,
      });

      const res = await imagekit.upload({
        file: fileBuffer.toString('base64'), 
        fileName: fileName,
        folder: '/rovexedits',
      });

      return {
        imageUrl: res.url,
        // ImageKit transformation for thumbnail
        thumbUrl: `${res.url}?tr=w-600,f-webp,q-auto`,
        provider: `imagekit:ik1`,
        bytes: res.size,
      };
    } catch (err) {
      console.error("ImageKit #1 upload failed", err);
    }
  }

  throw new Error("All CDN uploads failed or keys are not configured properly.");
}

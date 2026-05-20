import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({ secure: true });

function getCloudinaryConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  if (!cloudinaryUrl) {
    throw new Error('Cloudinary environment variable CLOUDINARY_URL is not configured.');
  }

  return cloudinaryUrl;
}

export async function POST(req: Request) {
  try {
    getCloudinaryConfig();

    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'sertim',
      resource_type: 'image',
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    return NextResponse.json({ message: 'Upload gagal.', error: String(error) }, { status: 500 });
  }
}

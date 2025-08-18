import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { s3Service } from '@/backend/shared/services/s3.service';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const { imageUrl, key } = await s3Service.uploadImage(file, 'routine-completions');

    return NextResponse.json({ imageUrl, key });
  } catch (error) {
    console.error('Error uploading image', error);
    return NextResponse.json({ error: 'Error uploading image' }, { status: 500 });
  }
}
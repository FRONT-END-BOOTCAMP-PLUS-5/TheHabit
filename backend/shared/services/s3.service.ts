import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

class S3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION_ENV,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_ENV as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ENV as string,
    },
  });

  async uploadImage(file: File, folder: string): Promise<{ imageUrl: string; key: string }> {
    try {
      const { name, type } = file;
      const key = `${folder}/${uuidv4()}-${name}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: process.env.AMPLIFY_BUCKET_ENV as string,
        Key: key,
        ContentType: type,
        Body: buffer,
      });

      await this.s3.send(command);

      const imageUrl = `https://${process.env.AMPLIFY_BUCKET_ENV}.s3.${process.env.AWS_REGION_ENV}.amazonaws.com/${key}`;

      return { imageUrl, key };
    } catch (e) {
      if (e instanceof Error) throw new Error(e.message);
      throw new Error('Failed to upload image to S3');
    }
  }

  async deleteImage(key: string): Promise<boolean> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AMPLIFY_BUCKET_ENV as string,
        Key: key,
      });

      await this.s3.send(deleteCommand);

      return true;
    } catch (e) {
      if (e instanceof Error) throw new Error(e.message);
      return false;
    }
  }
}

export const s3Service = new S3Service();

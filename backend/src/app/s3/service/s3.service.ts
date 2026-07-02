import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { injectable } from 'tsyringe';
import { CreatePresignedUrl } from '../dto/s3.dto.js';
import crypto from 'crypto';
import { env } from '../../../lib/config/env.js';

@injectable()
export class S3Service {
  private readonly s3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: env.s3.awsRegion,
      credentials: {
        accessKeyId: env.s3.awsAccessKeyId,
        secretAccessKey: env.s3.awsSecretAccessKey,
      },
    });
  }


  generateUploadUrl = async (data: CreatePresignedUrl) => {
    const bucketName = env.s3.awsS3BucketName;

    const uniqueFileName = `${crypto.randomBytes(16).toString('hex')}`;

    const fileExtension = data.contentType.split('/')[1] || 'jpg';
    const key = `${data.folder}/${uniqueFileName}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: data.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });
    const fileUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

    return {
      uploadUrl,
      fileUrl,
    };
  };
}

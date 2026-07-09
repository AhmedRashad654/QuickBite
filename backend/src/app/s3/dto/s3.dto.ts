import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { s3Forders } from '../enum.js';

export class CreatePresignedUrl {
  @IsEnum(s3Forders)
  @IsNotEmpty()
  folder!: s3Forders;

  @IsString()
  @IsNotEmpty()
  contentType!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  oldKey?: string;
}

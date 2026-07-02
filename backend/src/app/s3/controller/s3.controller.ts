import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../lib/di/tokens.js';
import { S3Service } from '../service/s3.service.js';
import { Request, Response } from 'express';
import { validateBody } from '../../../lib/validation/validate.js';
import { CreatePresignedUrl } from '../dto/s3.dto.js';
import { sendSuccess } from '../../../lib/http/response.js';

@injectable()
export class S3Controller {
  constructor(@inject(TOKENS.S3Service) private readonly s3Service: S3Service) {}

  getPresignedUrlController = async (req: Request, res: Response) => {
    const data = await validateBody(CreatePresignedUrl, req.body);
    const s3Data = await this.s3Service.generateUploadUrl(data);
    sendSuccess(res, s3Data);
  };
}

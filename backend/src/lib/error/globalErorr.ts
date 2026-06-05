import { AppError } from './AppError.js';

export const IdempotencyKeyRequiredError = new AppError('Idempotency-Key header is required for this endpoint.', 400);
export const ServiceUnavilable = new AppError('Service Unavailable', 503);

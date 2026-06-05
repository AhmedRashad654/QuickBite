import type { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError.js';
import { container } from '../di/container.js';
import { TOKENS } from '../di/tokens.js';
import { Logger } from '../logger/logger.js';

export function errorHandler(err: AppError, req: Request, res: Response, _next: NextFunction) {
  const operational = err.isOperational;

  const logger = container.resolve<Logger>(TOKENS.Logger);

  logger.error(err.message, {
    statusCode: err.statusCode,
    stack: err.stack,
    operational: operational,
    body: req.body,
    correlationId: req.correlationId,
  });

  if (operational) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }
  return res.status(500).json({
    error: 'Something went wrong',
  });
}

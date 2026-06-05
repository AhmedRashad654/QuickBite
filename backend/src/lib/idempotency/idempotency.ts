import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { IdempotencyKeyRequiredError, ServiceUnavilable } from '../error/globalErorr.js';
import { TOKENS } from '../di/tokens.js';
import { sendSuccess } from '../http/response.js';

interface IdempotencyOptions {
  strict?: boolean;
}

export function idempotency(options: IdempotencyOptions = {}) {
  const strict = options.strict ?? false;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const method = req.method;

    if (method !== 'POST' && method !== 'PATCH' && method !== 'PUT') {
      return next();
    }

    const idempotencyKey = req.headers['idempotency-key'] as string;

    if (!idempotencyKey) {
      if (strict) {
        throw IdempotencyKeyRequiredError;
      }
      return next();
    }

    let cacheProvider: any;
    const redisKey = `idempotency:${method.toLowerCase()}:${req.originalUrl}:${idempotencyKey}`;

    try {
      cacheProvider = container.resolve(TOKENS.CacheProvider);

      const cachedResponseString = await cacheProvider.get(redisKey);
      if (cachedResponseString) {
        const cachedData = JSON.parse(cachedResponseString);
        res.setHeader('X-Cache', 'HIT');
        sendSuccess(res, cachedData.body.data, cachedData.status || 200);
        return;
      }
    } catch {
      if (strict) {
        throw ServiceUnavilable;
      }
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any): any => {
      if (res.statusCode >= 200 && res.statusCode < 300 && cacheProvider) {
        const responseToCache = {
          status: res.statusCode,
          body: body,
        };

        cacheProvider
          .set(redisKey, JSON.stringify(responseToCache), 86400)
          .catch(() => console.error('Error in set data in redis background'));
      }
      res.setHeader('X-Cache', 'MISS');

      return originalJson(body);
    };

    return next();
  };
}

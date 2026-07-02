import { Request, Response, NextFunction } from 'express';
import { toSeconds } from '../utils/time.js';
import { container } from '../di/container.js';
import { ICacheProvider } from '../cache/cache.interface.js';
import { TOKENS } from '../di/tokens.js';

const DEFAULT_TTL = toSeconds(3, 'm');

interface IdempotencyOptions {
  strict?: boolean;
  ttlSeconds?: number;
}

export function idempotency(options: IdempotencyOptions = {}) {
  const { strict = false, ttlSeconds = DEFAULT_TTL } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!['POST', 'PATCH', 'PUT'].includes(req.method)) {
      return next();
    }

    const idempotencyKey = req.headers['idempotency-key'] as string | undefined;

    if (!idempotencyKey) {
      if (strict) {
        return res.status(400).json({ error: 'Missing Idempotency-Key header' });
      }
      return next();
    }

    try {
      const cacheProvider: ICacheProvider = container.resolve(TOKENS.CacheProvider);
      const key = `idempotency:${req.method}:${req.originalUrl}:${idempotencyKey}`;

      const isLockAcquired = await cacheProvider.trySet(key, 'PROCESSING', ttlSeconds);

      if (!isLockAcquired) {
        const cachedValue = await cacheProvider.get(key);
        if (cachedValue === 'PROCESSING') {
          return res.status(409).json({ error: 'Concurrent request in progress. Please wait.' });
        }

        if (cachedValue) {
          const { status, body } = JSON.parse(cachedValue);
          return res.status(status).json(body);
        }
      }
      
      const originalSend = res.send.bind(res);

      res.send = (body: any) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const cacheData = { status: res.statusCode, body: JSON.parse(body) };
          cacheProvider.set(key, JSON.stringify(cacheData), ttlSeconds).catch(console.error);
        } else {
          cacheProvider.del(key).catch(console.error);
        }
        return originalSend(body);
      };

      next();
    } catch (error) {
      console.log(error);
      if (strict) {
        return res.status(503).json({ error: 'Idempotency service unavailable' });
      }
      next();
    }
  };
}

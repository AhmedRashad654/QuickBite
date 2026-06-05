import { Redis } from 'ioredis';
import { ICacheProvider } from './cache.interface.js';
import { env } from '../config/env.js';

export class RedisCacheProvider implements ICacheProvider {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: env.redis.host,
      port: env.redis.port,
      password: env.redis.password,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    this.client.on('error', (err: any) => {
      console.log('Redis Error:', err.message);
    });

    this.client.connect().catch((err: any) => {
      console.error('Redis Connect Error:', err);
    });
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<any> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<any> {
    return this.client.get(key);
  }

  async del(key: string): Promise<any> {
    return this.client.del(key);
  }
}

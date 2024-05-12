import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './constants';

@Injectable()
export class RedisService implements OnModuleDestroy {

    public constructor(
        @Inject(REDIS_CLIENT) private readonly _redis: Redis,
      ) {}

    public getRedisClient(): Redis | undefined {
        return this._redis ?? undefined;
    }

    async onModuleDestroy() {
        await this._redis?.quit();
    }

    public async ping(): Promise<string> {
        return await this._redis?.ping() ?? "Redis is disabled";
    }

    public async set<T>(key: string, value: T): Promise<T> {
        await this._redis.set(key, Buffer.from(JSON.stringify(value)));
        return value;
    }

    public async get<T>(key: string): Promise<T | null> {
        const value = await this._redis.get(key);
        return value ? JSON.parse(value) : null;
    }

}

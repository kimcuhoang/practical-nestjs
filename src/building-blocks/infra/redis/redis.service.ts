import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisService implements OnModuleDestroy {

    public constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis,
      ) {}

    async onModuleDestroy() {
        await this.redis.quit();
    }

    public async ping(): Promise<string> {
        return await this.redis.ping();
    }

    public async set<T>(key: string, value: T): Promise<T> {
        await this.redis.set(key, Buffer.from(JSON.stringify(value)));
        return value;
    }

    public async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
    }

}

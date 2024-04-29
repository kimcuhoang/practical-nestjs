import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from './redis.module';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

    public constructor(
        @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
      ) {}

    onModuleInit() {
        this.redis.connect();
    }

    onModuleDestroy() {
        this.redis.quit();
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

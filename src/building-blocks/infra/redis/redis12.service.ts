import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { REDIS_CLIENT_12, RedisClient } from './constants';

@Injectable()
export class RedisService12 implements OnModuleInit, OnModuleDestroy {

    constructor(
        @Inject(REDIS_CLIENT_12) private readonly _redisClient: RedisClient,
    ) {}

    public getRedisClient(): RedisClient {
        return this._redisClient;
    }

    async onModuleDestroy() {
        await this._redisClient.quit();
    }

    async onModuleInit() {
        await this._redisClient.connect();
    }

    public async ping(): Promise<string> {
        return await this._redisClient.ping();
    }

    public async set<T>(key: string, value: T): Promise<T> {
        await this._redisClient.set(key, Buffer.from(JSON.stringify(value)));
        return value;
    }

    public async get<T>(key: string): Promise<T | null> {
        const value = await this._redisClient.get(key);
        return value ? JSON.parse(value) : null;
    }
}

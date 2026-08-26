import { Inject, Injectable } from "@nestjs/common";
import { CacheOptions } from "../../cache.options";
import { REDIS_CLIENT, YAN_CACHE_MODULE_OPTIONS } from "../../cache.symbols";
import Redis from "ioredis";

@Injectable()
export class HraCacheService {
    constructor(
        @Inject(YAN_CACHE_MODULE_OPTIONS)
        private readonly options: CacheOptions,
        @Inject(REDIS_CLIENT)
        protected readonly redisClient: Redis,
    ) { }

    public async set<T>(key: string, value: T, ttlInMinutes?: number): Promise<void> {
        if (!this.redisEnabled) {
            return;
        }

        const ttl = ttlInMinutes ?? 60; // default 1 hour
        const ttlInSeconds = ttl * 60;

        await this.redisClient.set(
            key,
            JSON.stringify(value),
            ttlInSeconds ? 'EX' : undefined,
            ttlInSeconds);
    }

    public async get<T>(key: string): Promise<T | null> {
        if (!this.redisEnabled) {
            return null;
        }

        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) as T : null;
    }

    public async delete(key: string): Promise<void> {
        if (!this.redisEnabled) {
            return;
        }
        await this.redisClient.del(key);
    }

    public async wrap<T>(key: string, fn: () => Promise<T>, timeToLiveInMinutes?: number): Promise<T> {
        if (!this.redisEnabled) {
            return await fn();
        }

        const cached = await this.get<T>(key);
        if (cached !== null) return cached;

        const result = await fn();
        await this.set(key, result, timeToLiveInMinutes);
        return result;
    }

    public async reset(pattern = '*'): Promise<void> {
        if (!this.redisEnabled) {
            return;
        }
        
        const keys = await this.redisClient.keys(pattern);
        if (keys.length) {
            await this.redisClient.del(...keys);
        }
    }

    public async setHash(key: string, field: string, value: any, timeToLiveInMinutes?: number): Promise<void> {
        if (!this.redisEnabled) {
            return;
        }

        await this.redisClient.hset(key, field, JSON.stringify(value));

        if (timeToLiveInMinutes) {
            const ttlInSeconds = timeToLiveInMinutes * 60;
            await this.redisClient.expire(key, ttlInSeconds);
        }
    }

    public async getHash<T>(key: string, field: string): Promise<T | null> {
        if (!this.redisEnabled) {
            return null;
        }

        const value = await this.redisClient.hget(key, field);
        return value ? JSON.parse(value) as T : null;
    }

    public async deleteHash(key: string, field: string): Promise<void> {
        if (!this.redisEnabled) {
            return;
        }
        await this.redisClient.hdel(key, field);
    }

    public async resetHash(pattern = '*'): Promise<void> {
        if (!this.redisEnabled) {
            return;
        }

        const keys = await this.redisClient.keys(pattern);
        if (keys.length) {
            await this.redisClient.del(...keys);
        }
    }

    public async wrapHash<T>(key: string, field: string, fn: () => Promise<T>, timeToLiveInMinutes?: number): Promise<T> {
        if (!this.redisEnabled) {
            return await fn();
        }

        const cached = await this.getHash<T>(key, field);
        if (cached !== null) return cached;

        const result = await fn();
        await this.setHash(key, field, result, timeToLiveInMinutes);
        return result;
    }

    private get redisEnabled(): boolean {
        return this.options.redisEnabled ?? true;
    }
}
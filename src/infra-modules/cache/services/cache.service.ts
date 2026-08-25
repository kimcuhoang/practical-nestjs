import { Inject, Injectable } from "@nestjs/common";
import { CacheOptions } from "../cache.options";
import { REDIS_CLIENT, YAN_CACHE_MODULE_OPTIONS } from "../cache.symbols";
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

        const ttl = ttlInMinutes ?? this.options.timeToLiveInMinutes;
        const ttlInSeconds = ttl ? ttl * 60 : undefined;

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

    public async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
        if (!this.redisEnabled) {
            return await fn();
        }

        const cached = await this.get<T>(key);
        if (cached !== null) return cached;

        const result = await fn();
        await this.set(key, result, ttl);
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

    private get redisEnabled(): boolean {
        return this.options.redisEnabled ?? true;
    }
}
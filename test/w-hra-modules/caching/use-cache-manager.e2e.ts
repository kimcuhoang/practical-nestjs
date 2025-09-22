import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { RedisStore } from "cache-manager-redis-yet";
import { RedisClientType } from "@redis/client";
import { app } from "@test/test.setup";

describe(`An e2e test with Caching Module with CacheManager`, () => {

    let cacheManager: Cache;
    let redisClient: RedisClientType | null = null;

    beforeAll(async () => {
        cacheManager = app.get(CACHE_MANAGER);
        const redisStore = cacheManager.store as RedisStore;
        redisClient = redisStore.client as unknown as RedisClientType;
    });

    test(`via cache manager`, async () => {
        const key = `test-key`;
        const value = `test-value`;

        await cacheManager.set(key, value);
        const cachedValue = await cacheManager.get(key);
        expect(cachedValue).toEqual(value);
    });

    test(`cache via redis client`, async () => {
        const key = `test-key`;
        const value = `test-value`;

        await redisClient.set(key, value);

        const redisValue = await redisClient.get(key);
        expect(redisValue).toEqual(value);
    });
});
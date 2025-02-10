import { faker } from "@faker-js/faker";
import { RedisIoRedisService } from "@building-blocks/infra/redis-ioredis";
import { app } from "@test/test.setup";

describe("Test for Redis with io-redis", () => {
    let redisService: RedisIoRedisService | undefined;

    const cacheKey = faker.string.uuid();
    const cacheObjects = faker.helpers.multiple(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName()
    }), { count: 5 });
    
    beforeEach(async () => {
        redisService = app.get(RedisIoRedisService, { strict: false });
        if (redisService.getRedisClient()) {
            await redisService.set(cacheKey, cacheObjects);
        }
    });

    it(`${RedisIoRedisService.name}`, async () => {
        if (redisService.getRedisClient()) {
            const objectsFromCache = await redisService.get(cacheKey);
            expect(objectsFromCache).toEqual(cacheObjects);
        }
    });
});
import { faker } from "@faker-js/faker";
import { RedisService } from "@building-blocks/infra/redis/redis.service";
import { app } from "@test/test.setup";

describe("Test Redis", () => {
    let redisService: RedisService;

    const cacheKey = faker.string.uuid();
    const cacheObjects = faker.helpers.multiple(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName()
    }), { count: 5 });
    
    beforeEach(async () => {
        redisService = app.get<RedisService>(RedisService);
        if (redisService.getRedisClient()) {
            await redisService.set(cacheKey, cacheObjects);
        }
    });

    it(`${RedisService.name}`, async () => {
        if (redisService.getRedisClient()) {
            const objectsFromCache = await redisService.get(cacheKey);
            expect(objectsFromCache).toEqual(cacheObjects);
        }
    });
});
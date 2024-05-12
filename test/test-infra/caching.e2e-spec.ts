import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { RedisService } from "@src/building-blocks/infra/redis/redis.service";
// import { app } from "@test/test.setup";

describe("Test - Caching", () => {
    let redisService: RedisService | undefined;

    const cacheKey = faker.string.uuid();
    const cacheObjects = faker.helpers.multiple(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName()
    }), { count: 5 });
    
    beforeEach(async () => {
        // const app = (globalThis.Application as INestApplication);
        // redisService = app?.get<RedisService>(RedisService);

        const testingModule = globalThis.TestingModule as TestingModule;
        redisService = testingModule.get<RedisService>(RedisService);

        if (redisService.getRedisClient()) {
            await redisService.set(cacheKey, cacheObjects);
        }
        
    });

    it("Setup Caching Provider", async () => {
        if (redisService.getRedisClient()) {
            const objectsFromCache = await redisService.get(cacheKey);
            expect(objectsFromCache).toEqual(cacheObjects);
        }
    });
});
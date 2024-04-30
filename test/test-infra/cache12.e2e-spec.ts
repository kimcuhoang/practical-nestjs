import { faker } from "@faker-js/faker";
import { RedisService12 } from "@src/building-blocks/infra/redis/redis12.service";
import { app } from "@test/test.setup";



describe("Test - Caching", () => {
    let redisService: RedisService12;

    const cacheKey = faker.string.uuid();
    const cacheObjects = faker.helpers.multiple(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName()
    }), { count: 5 });
    
    beforeEach(async () => {
        redisService = app.get<RedisService12>(RedisService12);
        await redisService.set(cacheKey, cacheObjects);
    });

    it("Setup Caching Provider", async () => {
        const objectsFromCache = await redisService.get(cacheKey);
        expect(objectsFromCache).toEqual(cacheObjects);
    });

});
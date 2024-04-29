import { faker } from "@faker-js/faker";
import { CachingProvider } from "@src/building-blocks/infra/caching/caching.provider";
import { app } from "@test/test.setup";



describe("Test - Caching", () => {
    let cachingProvider: CachingProvider;
    
    let cachedObject = {
        id: faker.string.uuid(),
        name: faker.person.fullName()
    };

    beforeEach(async () => {
        cachingProvider = app.get<CachingProvider>(CachingProvider);
        await cachingProvider.setValue(cachedObject.id, cachedObject);
    });

    it("Setup Caching Provider", async () => {
        const value = await cachingProvider.get(cachedObject.id);
        expect(value).toEqual(cachedObject);
    });

});
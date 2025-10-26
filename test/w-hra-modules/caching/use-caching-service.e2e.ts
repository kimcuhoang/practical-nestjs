import { CachingService } from "@src/infra-modules/caching";
import { app } from "@test/test.setup";


describe(`An e2e test with Caching Module with CachingService`, () => {
    let cachingService: CachingService;

    beforeAll(() => {
        cachingService = app.get(CachingService.name);
    });

    test(`should cache data`, async () => {
        const key = `test-key`;
        const value = `test-value`;

        await cachingService.set(key, value);
        const cachedValue = await cachingService.get(key);
        expect(cachedValue).toEqual(value);
    });
});
import { CachingService } from "@src/infra-modules/caching";


describe(`An e2e test with Caching Module with CachingService`, () => {
    let cachingService: CachingService;

    beforeAll(() => {
        cachingService = global.testingModule.get(CachingService);
    });

    test(`should cache data`, async () => {
        const key = `test-key`;
        const value = `test-value`;

        await cachingService.set(key, value);
        const cachedValue = await cachingService.get(key);
        expect(cachedValue).toEqual(value);
    });
});
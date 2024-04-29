import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingProvider {
    constructor(
        @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache
    ){}

    public async setValue<T>(key: string, value: T, ttl?: number) : Promise<void> {
        await this._cacheManager.set(key, value, ttl);
    }

    public async set<T>(key: string, valueFn: Promise<T>, ttl?: number) : Promise<T> {
        const value = await valueFn;
        await this._cacheManager.set(key, value, ttl);
        return value;
    }

    public async get<T>(key: string) : Promise<T> {
        return await this._cacheManager.get<T>(key);
    }

    public async remove(key: string) : Promise<void> {
        await this._cacheManager.del(key);
    }

    public async replace<T>(key: string, valueFn: Promise<T>, ttl?: number) : Promise<T> {
        await this.remove(key);
        return this.set(key, valueFn, ttl);
    }

    public async getOrSetIfMissing<T>(key: string, valueFn: Promise<T>, ttl?: number) : Promise<T> {
        let valueFromCache = await this.get<T>(key);

        if (valueFromCache) {
            return valueFromCache;
        }

        return await this.set(key, valueFn, ttl);
    }
}

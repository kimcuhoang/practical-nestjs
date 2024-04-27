import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingProvider {
    constructor(
        @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache
    ){}

    public async set<T>(key: string, callback: () => Promise<T>, ttl?: number) : Promise<T> {
        const value = await callback;
        await this._cacheManager.set(key, value, ttl);
        return value as T;
    }

    public async get<T>(key: string) : Promise<T> {
        return await this._cacheManager.get<T>(key);
    }

    public async remove(key: string) : Promise<void> {
        await this._cacheManager.del(key);
    }

    // public async replace(key: string, callback: () => any, ttl?: number) : Promise<void> {
    //     await this.remove(key);
    //     await this.set(key, callback, ttl);
    // }

    public async getOrSetIfMissing<T>(key: string, callback: () => Promise<T>, ttl?: number) : Promise<T> {
        let valueFromCache = await this.get<T>(key);

        if (valueFromCache) {
            return valueFromCache;
        }

        return await this.set(key, callback, ttl);
    }
}

import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Inject, Injectable } from "@nestjs/common/decorators/core";
import { Logger } from "@nestjs/common";

@Injectable()
export class CachingService {
    private readonly logger = new Logger(CachingService.name);
    constructor(
        @Inject(CACHE_MANAGER) 
        private cacheManager: Cache
    ){}

    public async get(key: string): Promise<any> {
        this.logger.log(`Getting cache for key: ${key}`);
        return await this.cacheManager.get(key);
    }

    public async set(key: string, value: any): Promise<void> {
        this.logger.log(`Setting cache for key: ${key}`);
        await this.cacheManager.set(key, value);
    }

    public async del(key: string): Promise<void> {
        this.logger.log(`Deleting cache for key: ${key}`);
        await this.cacheManager.del(key);
    }

}
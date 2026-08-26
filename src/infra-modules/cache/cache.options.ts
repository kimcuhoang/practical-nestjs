import { ModuleMetadata } from "@nestjs/common";
import { HraRedisService } from "./services/redis-service/redis.service";

export type CacheOptions = {
    timeToLiveInMinutes?: number;
    redisConnectionString: string;
    redisEnabled?: boolean;
};

export type HraCacheModuleOptions = Pick<ModuleMetadata, 'imports'> &
{
    cacheOptions?: {
        useFactory: (...args: any[]) => Promise<CacheOptions> | CacheOptions;
        inject?: any[];
    },
    overrideYanRedisService?: {
        useFactory: (...args: any[]) => Promise<HraRedisService> | HraRedisService;
        inject?: any[];
    },
    overrideYanCacheService?: {
        useFactory: (...args: any[]) => Promise<HraRedisService> | HraRedisService;
        inject?: any[];
    }
};
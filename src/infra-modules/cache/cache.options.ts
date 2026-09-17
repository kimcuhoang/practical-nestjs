import { ClassProvider, FactoryProvider, ModuleMetadata, Provider } from "@nestjs/common";
import { HraRedisService } from "./services/redis-service/redis.service";
import { HraCacheService } from "./services/cache-service/cache.service";

export type CacheOptions = {
    timeToLiveInMinutes?: number;
    redisConnectionString: string;
    redisEnabled?: boolean;
};

export type HraCacheModuleOptions = Pick<ModuleMetadata, 'imports'> &
{
    cacheOptions?: Omit<FactoryProvider<CacheOptions>, "provide">;
    overrideYanRedisService?: Omit<Provider<Promise<HraRedisService> | HraRedisService>, "provider">
                                & Omit<ClassProvider<Promise<HraRedisService> | HraRedisService>, "provide">;
    overrideYanCacheService?: Omit<Provider<Promise<HraCacheService> | HraCacheService>, "provider">
                                & Omit<ClassProvider<Promise<HraCacheService> | HraCacheService>, "provide">;
};
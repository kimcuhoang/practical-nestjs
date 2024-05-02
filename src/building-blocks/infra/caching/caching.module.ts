import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisService } from '../redis/redis.service';
import { CachingProvider } from './caching.provider';

@Global()
@Module({})
export class CachingModule {
    public static register(): DynamicModule {

        const cacheDynamicModule: DynamicModule = CacheModule.registerAsync({
            isGlobal: true,
            inject: [ConfigService, RedisService],
            useFactory: async (configService: ConfigService, redisService: RedisService) => {

                const ttl = configService.get<number>('CACHE_TTL') || parseInt(process.env.CACHE_TTL!, 10) || 6000;

                const useInMemoryCache = configService.get<boolean>('USE_MEMORY_CACHE') 
                        || process.env.USE_MEMORY_CACHE?.toLowerCase() === 'true'
                        || false;

                if (useInMemoryCache) {
                    return {
                        store: "memory",
                        ttl: ttl
                    };
                }

                const redisClient = redisService.getRedisClient();
                const redisOptions = redisClient.options;
                const storeInstance = await redisStore({
                    ...redisOptions
                });

                return {
                    store: storeInstance,
                    ttl: ttl
                };
            }
        });

        return {
            module: CachingModule,
            imports: [cacheDynamicModule],
            providers: [CachingProvider],
            exports: [CachingProvider]
        };
    }
}

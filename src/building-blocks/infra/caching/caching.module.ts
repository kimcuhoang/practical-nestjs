import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisIoRedisService } from '../redis-ioredis/redis-ioredis.service';
import { CachingProvider } from './caching.provider';

@Global()
@Module({})
export class CachingModule {
    public static register(): DynamicModule {

        const cacheDynamicModule: DynamicModule = CacheModule.registerAsync({
            isGlobal: true,
            inject: [ConfigService, RedisIoRedisService],
            useFactory: async (configService: ConfigService, redisService: RedisIoRedisService) => {

                const ttl = configService.get<number>('CACHE_TTL') || parseInt(process.env.CACHE_TTL!, 10) || 6000;

                const redisClient = redisService?.getRedisClient() ?? undefined;

                if (redisClient) {
                    const redisOptions = redisClient.options;
                    const storeInstance = await redisStore({
                        ...redisOptions
                    });

                    return {
                        store: storeInstance,
                        ttl: ttl
                    };
                }

                return {
                    store: "memory",
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

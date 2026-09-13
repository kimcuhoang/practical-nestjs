import { DynamicModule, Logger, Module, Provider } from "@nestjs/common";
import { HraCacheModuleOptions, CacheOptions } from "./cache.options";
import { REDIS_CLIENT, REDIS_SERVICE, YAN_CACHE_MODULE_OPTIONS, YAN_CACHE_SERVICE } from "./cache.symbols";
import Redis from "ioredis";
import { HraRedisService } from "./services/redis-service/redis.service";
import { HraCacheService } from "./services/cache-service/cache.service";


@Module({})
export class HraCacheModule {
    public static forRoot(options: HraCacheModuleOptions): DynamicModule {
        const logger = new Logger(HraCacheModule.name);

        const cacheOptionsProvider: Provider<CacheOptions> = {
            provide: YAN_CACHE_MODULE_OPTIONS,
            ... options.cacheOptions
        };

        const redisClientProvider: Provider = {
            provide: REDIS_CLIENT,
            useFactory: (options: CacheOptions) => {
                const redisClient = new Redis(options.redisConnectionString);

                redisClient.on("error", (err: Error) => {
                    logger.error(`Redis error: ${err.message}`, err.stack);
                });

                redisClient.on("ready", () => {
                    logger.warn("Redis is ready");
                });

                redisClient.on("connecting", () => {
                    logger.warn("Redis is connecting");
                });

                redisClient.on('connect', () => {
                    logger.warn('Redis connected')
                });

                return redisClient;
            },
            inject: [YAN_CACHE_MODULE_OPTIONS],
        };

        const redisServiceProvider: Provider = {
            provide: REDIS_SERVICE,
            ...options.overrideYanRedisService ?? {
                useClass: HraRedisService
            }
        };

        const cacheServiceProvider: Provider = {
            provide: YAN_CACHE_SERVICE,
            ...options.overrideYanCacheService ?? {
                useClass: HraCacheService
            }
        }

        return {
            module: HraCacheModule,
            global: true,
            providers: [
                cacheOptionsProvider,
                redisClientProvider,
                redisServiceProvider,
                cacheServiceProvider
            ],
            exports: [
                YAN_CACHE_MODULE_OPTIONS,
                REDIS_CLIENT,
                REDIS_SERVICE,
                YAN_CACHE_SERVICE
            ]
        }
    }
}
import { CacheModule, CacheOptions } from "@nestjs/cache-manager";
import { DynamicModule, Module, Provider } from "@nestjs/common";
import { CachingService } from "./caching.service";
import { ConfigService } from "@nestjs/config";
import { CacheSettings } from "./cache-settings";
import { CachingController } from "./controllers/caching.controller";
import { RedisStore, redisStore } from "cache-manager-redis-yet";
import { RedisClientType } from "redis";
import { StoreConfig } from "cache-manager";

export const CACHE_SETTINGS_SYMBOL = Symbol('CACHE_SETTINGS_SYMBOL');
export const REDIS_STORE_SYMBOL = Symbol('REDIS_STORE_SYMBOL');

@Module({})
export class CachingModule {
    public static forRoot(cacheSettings: (configService: ConfigService) => CacheSettings): DynamicModule {

        const settingsProvider: Provider = {
            provide: CACHE_SETTINGS_SYMBOL,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return cacheSettings(configService);
            }
        };

        const redisStoreProvider: Provider = {
            provide: REDIS_STORE_SYMBOL,
            inject: [CACHE_SETTINGS_SYMBOL],
            useFactory: async (settings: CacheSettings): Promise<RedisStore<RedisClientType> | null> => {
                if (settings.store === 'redis') {
                    return await redisStore({
                        url: settings.redisUrl,
                        ttl: settings.ttl * 60000,
                        socket: {
                            connectTimeout: 50000,
                            reconnectStrategy: false
                        }
                    });
                }
                return null;
            }
        };

        const cacheManagerModule = CacheModule.registerAsync({
            isGlobal: true,
            extraProviders: [
                settingsProvider,
                redisStoreProvider
            ],
            inject: [CACHE_SETTINGS_SYMBOL, REDIS_STORE_SYMBOL],
            useFactory: async (settings: CacheSettings, redisStore: RedisStore<RedisClientType> | null): Promise<CacheOptions<StoreConfig>> => {
                const ttlMs = settings.ttl * 60000;
                const commonOptions = {
                    ttl: ttlMs,
                    max: settings.max,
                    isGlobal: true,
                };
                return settings.store === 'memory'
                    ? { store: 'memory', ...commonOptions }
                    : {
                        store: redisStore,
                        ...commonOptions,
                    };
            }
        });

        return {
            module: CachingModule,
            global: true,
            imports: [
                cacheManagerModule
            ],
            providers: [
                CachingService
            ],
            exports: [
                CachingService
            ],
            controllers: [
                CachingController
            ]
        } as DynamicModule;
    }
}
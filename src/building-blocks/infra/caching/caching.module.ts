import { CacheModule, } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CachingProvider } from './caching.provider';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({})
export class CachingModule {

    public static register() : DynamicModule {

        const cacheDynamicModule: DynamicModule = CacheModule.registerAsync({
            isGlobal: true,
            inject: [ ConfigService ],
            useFactory: async(configService: ConfigService) => {

                if (configService.get<string>('REDIS_CACHE_ENABLED')?.toLowerCase() === 'true') {

                    const storeInstance = await redisStore({
                        url: configService.get<string>('REDIS_URL'),
                    });

                    storeInstance.client.on('error', (error) => {
                        console.error(error);
                    });

                    return {
                        store: storeInstance
                    };
                }

                return {
                    store: "memory"
                };
            }
        });

        return {
            module: CachingModule,
            imports: [ cacheDynamicModule ],
            providers: [ CachingProvider ],
            exports: [ CachingProvider ]
        };
    }
}

import { CacheModule } from '@nestjs/cache-manager';
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
                return ({
                    store: configService.get<string>("REDIS_ENABLED")?.toLowerCase() === 'false' 
                        ? 'memory'
                        : await redisStore({
                            // url: configService.get<string>("REDIS_URL"),
                            // host: configService.get<string>(""),
                            username: configService.get<string>("REDIS_USERNAME"),
                            password: configService.get<string>("REDIS_PASSWORD"),
                            socket: {
                                host: configService.get<string>("REDIS_HOST"),
                                port: configService.get<number>("REDIS_PORT")
                            }
                        })
                });
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

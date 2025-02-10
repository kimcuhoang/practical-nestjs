import { DynamicModule, FactoryProvider, Global, LoggerService, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { REDIS_CLIENT, RedisClient } from './constants';
import { createClient } from 'redis';

/*
yarn add redis -D
*/

@Global()
@Module({})
export class RedisModule {
    public static register(): DynamicModule {

        const redisClientFactory: FactoryProvider<Promise<RedisClient | undefined>> = {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {

                const redisUrl = configService.get<string>('REDIS_URL');

                if (!redisUrl) {
                    return undefined;
                }

                const client = createClient({
                    url: redisUrl,
                    database: 0,
                })
                .on('error', (error) => {
                    console.error(error);
                });

                return client;
            },
        };

        return {
            module: RedisModule,
            providers: [ redisClientFactory, RedisService ],
            exports: [ RedisService ],
        };
    }
}

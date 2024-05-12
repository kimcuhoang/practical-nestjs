import { DynamicModule, FactoryProvider, Global, LoggerService, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService12 } from './redis12.service';
import { REDIS_CLIENT_12, RedisClient } from './constants';
import { createClient } from 'redis';

/*
yarn add redis -D
*/

@Global()
@Module({})
export class RedisModule12 {
    public static register(): DynamicModule {

        const redisClientFactory: FactoryProvider<Promise<RedisClient | undefined>> = {
            provide: REDIS_CLIENT_12,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {

                const redisUrl = configService.get<string>('REDIS_URL') ?? undefined;

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
            module: RedisModule12,
            providers: [ redisClientFactory, RedisService12 ],
            exports: [ RedisService12 ],
        };
    }
}

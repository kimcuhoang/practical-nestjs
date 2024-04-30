import { DynamicModule, FactoryProvider, Global, LoggerService, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService12 } from './redis12.service';

export const REDIS_CLIENT_12 = Symbol('REDIS_CLIENT_12');
export type RedisClient = ReturnType<typeof createClient>;

/*
yarn add redis -D
*/

@Module({})
export class RedisModule12 {
    public static register(): DynamicModule {

        const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
            provide: REDIS_CLIENT_12,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const client = createClient({
                    url: configService.get<string>('REDIS_URL'),
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

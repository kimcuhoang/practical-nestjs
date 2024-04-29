import { DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export type RedisClient = ReturnType<typeof createClient>;

@Module({})
export class RedisModule {
    public static register(): DynamicModule {

        const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const client = createClient({
                    url: configService.get<string>('REDIS_URL'),
                    database: 0,
                    socket: {
                        tls: false
                    }
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

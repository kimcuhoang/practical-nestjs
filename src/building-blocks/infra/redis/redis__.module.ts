import { DynamicModule, FactoryProvider, Global, LoggerService, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export type RedisClient = ReturnType<typeof createClient>;

@Module({})
export class RedisModule12 {
    public static register(): DynamicModule {

        const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const client = createClient({
                    url: configService.get<string>('REDIS_URL'),
                    pingInterval: 1000,
                    // legacyMode: true,
                    // database: 0,
                    // socket: {
                    //     tls: false,
                    //     host: configService.get<string>('REDIS_HOST'),
                    //     port: configService.get<number>('REDIS_PORT'),
                    // }
                });

                client.on('error', (error) => {
                    console.error(error);
                });

                return client;
            },
        };

        return {
            module: RedisModule12,
            providers: [ redisClientFactory, RedisService ],
            exports: [ RedisService ],
        };
    }
}

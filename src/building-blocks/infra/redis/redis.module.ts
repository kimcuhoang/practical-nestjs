import { DynamicModule, FactoryProvider, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
import { RedisService } from "./redis.service";

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

/*
yarn add ioredis -D
*/

@Module({})
export class RedisModule {
    public static register(): DynamicModule {

        const redisClientFactory: FactoryProvider<Promise<Redis>> = {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const client = new Redis({
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                    db: 0,
                    keepAlive: 1000,
                    connectTimeout: 2000
                })
                .on('error', (error) => {
                    console.error(error);
                });

                return client;
            },
        }; 

        return {
            module: RedisModule,
            providers: [redisClientFactory, RedisService],
            exports: [RedisService],
        };
    }
}
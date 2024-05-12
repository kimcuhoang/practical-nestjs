import { DynamicModule, FactoryProvider, Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
import { RedisService } from "./redis.service";
import { REDIS_CLIENT } from "./constants";



/*
yarn add ioredis -D
*/

@Global()
@Module({})
export class RedisModule {
    public static register(): DynamicModule {

        const redisClientFactory: FactoryProvider<Promise<Redis | undefined>> = {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<Redis | undefined> => {

                const redisHost = configService.get<string>('REDIS_HOST') ?? undefined;
                const redisPort = configService.get<number>('REDIS_PORT') ?? undefined;

                if (!redisHost || !redisPort) {
                    return undefined;
                }

                const client = new Redis({
                    host: redisHost,
                    port: redisPort,
                    db: 0,
                    // keepAlive: 1000,
                    // connectTimeout: 2000,
                    showFriendlyErrorStack: true,
                    lazyConnect: true,
                    enableReadyCheck: true,
                    reconnectOnError: (err: Error) => {
                        console.log(`Redis Cache connection err: ${err}`);
                        return true;
                    }
                })
                .on('connect', () => {
                    console.log(`Redis-Module: Connected to redis instance`)
                })
                .on('ready', () => {
                    console.log(`Redis-Module: Redis instance is ready`)
                })
                .on('error', (error) => {
                    console.error(`Redis-Module: Error: ${error}`);
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
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { StartedRedisContainer } from "@testcontainers/redis";
import { INestApplication } from '@nestjs/common';

export declare global {

    declare module globalThis {

        var postgresContainer: StartedPostgreSqlContainer;
        var redisContainer: StartedRedisContainer = undefined;
        var redisEnabled: boolean | false;
    }
}
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { StartedRedisContainer } from "@testcontainers/redis";
import { INestApplication } from '@nestjs/common';
import { EntityManager, Repository } from "typeorm";

export declare global {
    declare module globalThis {
        var postgresContainer: StartedPostgreSqlContainer;
        var redisContainer: StartedRedisContainer = undefined;
        var redisEnabled: boolean | false;
        var nestApp: INestApplication<any>;
        var entityManager: EntityManager;
    }
}
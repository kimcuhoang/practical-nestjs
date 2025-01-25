import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { StartedRedisContainer } from "@testcontainers/redis";
import { INestApplication } from '@nestjs/common';
import { CommandBus } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

export declare global {

    declare module globalThis {

        var postgresContainer: StartedPostgreSqlContainer;
        var redisContainer: StartedRedisContainer = undefined;
        var redisEnabled: boolean | false;

        var nestApp: INestApplication<any>;
        var httpServer: any;
        var request: any;

        var commandBus: CommandBus;
        var entityManager: EntityManager;
    }
}
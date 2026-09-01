import { INestApplication } from "@nestjs/common";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { StartedRedisContainer } from "@testcontainers/redis";
import TestAgent from "supertest/lib/agent";

declare global {
    var postgresContainer: StartedPostgreSqlContainer;
    var redisContainer: StartedRedisContainer;
    var redisEnabled: boolean | false;

    var nestApp: INestApplication<any>;
    var httpClient: TestAgent;
}

export { };
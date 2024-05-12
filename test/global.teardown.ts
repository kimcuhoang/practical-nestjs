import { INestApplication } from "@nestjs/common";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { StartedRedisContainer } from "@testcontainers/redis";


module.exports = async() => {

    await (globalThis.Application as INestApplication)?.close();

    await (globalThis.RedisContainer as StartedRedisContainer)?.stop({
        remove: true,
        timeout: 50000
    });

    await (globalThis.PosgresContainer as StartedPostgreSqlContainer)?.stop({
        remove: true,
        timeout: 50000
    });
};
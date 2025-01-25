import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';

module.exports = async () => {

    globalThis.postgresContainer = await new PostgreSqlContainer("postgres:alpine3.20")
        .withDatabase("practical-nestjs-testing")
        .withUsername("postgres")
        .withPassword("postgres")
        .withNetworkAliases("practical-nestjs-network")
        .withStartupTimeout(50000)
        .start();

    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisUrl = process.env.REDIS_URL;

    const redisIsEnabled = (redisHost !== undefined && redisHost !== "" && redisPort !== undefined && redisPort != "")
        || (redisUrl !== undefined && redisUrl !== "");

    globalThis.redisEnabled = redisIsEnabled;

    if (redisIsEnabled) {

        globalThis.redisContainer = await new RedisContainer("redis:alpine")
            .withNetworkAliases("practical-nestjs-network")
            .withStartupTimeout(50000)
            .start();

        process.env.REDIS_URL = globalThis.redisContainer.getConnectionUrl();
        process.env.REDIS_HOST = globalThis.redisContainer.getHost();
        process.env.REDIS_PORT = globalThis.redisContainer.getFirstMappedPort().toString();
    }

    process.env.POSTGRES_DATABASE_URL = globalThis.postgresContainer.getConnectionUri();
    process.env.POSTGRES_LOG_ENABLED = "false";
    process.env.FALLBACK_LANGUAGE = "en";
    process.env.SOLACE_ENABLED = "false";
    process.env.LOG_LEVELS = "log";//warn|error";
};

require("tsconfig-paths/register");
// require("ts-node/register");
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';
import { AppModule } from '@src/app.module';

module.exports = async () => {
    const postgresContainer = await new PostgreSqlContainer("postgres:alpine")
        .withDatabase("practical-nestjs-testing")
        .withUsername("postgres")
        .withPassword("postgres")
        .withNetworkAliases("practical-nestjs-network")
        .withStartupTimeout(50000)
        .start();

    process.env.DATABASE_URL = postgresContainer.getConnectionUri();

    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisUrl = process.env.REDIS_URL;

    const redisIsEnabled = (redisHost && redisPort) || redisUrl;

    if (redisIsEnabled) {

        const redisContainer = await new RedisContainer("redis:alpine")
                    .withNetworkAliases("practical-nestjs-network")
                    .withStartupTimeout(50000)
                    .start();

        globalThis.RedisContainer = redisContainer;

        process.env.REDIS_URL = redisContainer.getConnectionUrl();
        process.env.REDIS_HOST = redisContainer.getHost();
        process.env.REDIS_PORT = redisContainer.getPort().toString();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
    .compile();

    const app = moduleFixture
        .createNestApplication()
        .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();

    globalThis.PostgresContainer = postgresContainer;
    globalThis.Application = app;
    globalThis.ConnectionString = postgresContainer.getConnectionUri();
    globalThis.AppModule = moduleFixture;
};
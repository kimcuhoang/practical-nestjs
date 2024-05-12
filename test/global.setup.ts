require("ts-node/register");
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

    const redisContainer = await new RedisContainer("redis:alpine")
        .withNetworkAliases("practical-nestjs-network")
        .withStartupTimeout(50000)
        .start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
    .compile();

    const app = moduleFixture
        .createNestApplication()
        .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();

    globalThis.PostgresContainer = postgresContainer;
    globalThis.RedisContainer = redisContainer;
    globalThis.Application = app;
};
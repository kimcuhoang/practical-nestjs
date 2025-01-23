require("tsconfig-paths/register");
import 'dotenv/config';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common';
import { EntityManager } from 'typeorm';

module.exports = async () => {

    process.env.FALLBACK_LANGUAGE = "en";
    process.env.SOLACE_ENABLED = "false";
    process.env.LOG_LEVELS = "log";//warn|error";

    const postgresContainer = await new PostgreSqlContainer("postgres:alpine3.20")
        .withDatabase("practical-nestjs-testing")
        .withUsername("postgres")
        .withPassword("postgres")
        .withNetworkAliases("practical-nestjs-network")
        .withStartupTimeout(50000)
        .start();

    globalThis.postgresContainer = postgresContainer;

    process.env.POSTGRES_DATABASE_URL = postgresContainer.getConnectionUri();
    process.env.POSTGRES_LOG_ENABLED = "false";
    
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisUrl = process.env.REDIS_URL;

    const redisIsEnabled = (redisHost !== undefined && redisHost !== "" && redisPort !== undefined && redisPort != "")
        || (redisUrl !== undefined && redisUrl !== "");

    globalThis.redisEnabled = redisIsEnabled;

    if (redisIsEnabled) {

        const redisContainer = await new RedisContainer("redis:alpine")
            .withNetworkAliases("practical-nestjs-network")
            .withStartupTimeout(50000)
            .start();

        globalThis.redisContainer = redisContainer;
    }

    initializeTransactionalContext({
        storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
    }).compile();

    const app = moduleFixture.createNestApplication({
        abortOnError: true,
        bodyParser: true
    });

    app.useGlobalPipes(new I18nValidationPipe());
    app.useGlobalFilters(
        new I18nValidationExceptionFilter({
            detailedErrors: true
        })
    );

    const configService = app.get<ConfigService>(ConfigService);
    const logLevels = configService.get("LOG_LEVELS")?.split("|") ?? [];
    app.useLogger(logLevels as LogLevel[]);

    // await globalThis.nestApp.init();

    await app.init();

    globalThis.nestApp = app;
    globalThis.entityManager = app.get<EntityManager>(EntityManager);
};
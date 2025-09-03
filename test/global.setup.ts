import 'dotenv/config';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { INestApplication, LogLevel } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '@src/app.module';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import * as httpClient from 'supertest';
import TestAgent from 'supertest/lib/agent';

declare global {
    var postgresContainer: StartedPostgreSqlContainer;
    var redisContainer: StartedRedisContainer | undefined;
    var redisEnabled: boolean | false;
    var nestApp: INestApplication<any>;
    var testingModule: TestingModule;

    var httpClient: TestAgent;

    var getProvider: (token: any) => any;
}

export default async function globalSetup() {
    global.postgresContainer = await new PostgreSqlContainer("postgres:alpine3.20")
                        .withDatabase("practical-nestjs-testing")
                        .withUsername("postgres")
                        .withPassword("postgres")
                        .withNetworkAliases("practical-nestjs-network")
                        .withStartupTimeout(50000)
                        .start();

    const cacheStore = process.env.CACHE_STORE;
    const redisIsEnabled = cacheStore === 'redis';
        
    global.redisEnabled = redisIsEnabled;

    if (redisIsEnabled) {
        global.redisContainer = await new RedisContainer("redis:alpine")
                        .withNetworkAliases("practical-nestjs-network")
                        .withStartupTimeout(50000)
                        .start();
        process.env.CACHE_REDIS_URL = global.redisContainer.getConnectionUrl();
    }

    process.env.POSTGRES_DATABASE_URL = global.postgresContainer.getConnectionUri();
    process.env.POSTGRES_LOG_ENABLED = "!true";
    process.env.FALLBACK_LANGUAGE = "en";
    process.env.SOLACE_ENABLED = "false";
    process.env.LOG_LEVELS = "log";//warn|error";

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

    app.useGlobalPipes(new I18nValidationPipe({
        //since we don't config @nestjs/swagger CLI plugin
        // TODO: config ts-jest within @nestjs/swagger
        whitelist: false, 
        transform: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
        always: true,
        transformOptions: {
            enableImplicitConversion: true,
        }
    }));
    
    app.useGlobalFilters(
        new I18nValidationExceptionFilter({
            detailedErrors: true
        })
    );

    const configService = app.get<ConfigService>(ConfigService);
    const logLevels = configService.get("LOG_LEVELS")?.split("|") ?? [];
    app.useLogger(logLevels as LogLevel[]);


    global.nestApp = await app.init();
    global.testingModule = moduleFixture;
    global.httpClient = httpClient(app.getHttpServer());
};
    

// module.exports = async () => {

//     globalThis.postgresContainer = await new PostgreSqlContainer("postgres:alpine3.20")
//                         .withDatabase("practical-nestjs-testing")
//                         .withUsername("postgres")
//                         .withPassword("postgres")
//                         .withNetworkAliases("practical-nestjs-network")
//                         .withStartupTimeout(50000)
//                         .start();

//     const cacheStore = process.env.CACHE_STORE;
//     const redisIsEnabled = cacheStore === 'redis';
        
//     globalThis.redisEnabled = redisIsEnabled;

//     if (redisIsEnabled) {
//         globalThis.redisContainer = await new RedisContainer("redis:alpine")
//                         .withNetworkAliases("practical-nestjs-network")
//                         .withStartupTimeout(50000)
//                         .start();
//     }
// };


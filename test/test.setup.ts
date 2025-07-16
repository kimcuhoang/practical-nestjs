import { INestApplication, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import * as httpClient from 'supertest';
import * as moment from "moment";
import * as TestHelpers from "@test/test-helpers";

let app: INestApplication;
let connectionString: string;
let request: any | undefined;

beforeAll(async () => {

    connectionString = globalThis.postgresContainer.getConnectionUri();

    process.env.POSTGRES_DATABASE_URL = connectionString;
    process.env.POSTGRES_LOG_ENABLED = "!true";
    process.env.FALLBACK_LANGUAGE = "en";
    process.env.SOLACE_ENABLED = "false";
    process.env.LOG_LEVELS = "log";//warn|error";

    if (globalThis.redisEnabled) {

        globalThis.console.log("Redis is enabled");

        const redisUrl = globalThis.redisContainer.getConnectionUrl();

        process.env.REDIS_URL = redisUrl;
        process.env.REDIS_HOST = globalThis.redisContainer.getHost();
        process.env.REDIS_PORT = globalThis.redisContainer.getFirstMappedPort().toString();
    }

    initializeTransactionalContext({
        storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication({
        abortOnError: true,
        bodyParser: true
    });

    app.useGlobalPipes(new I18nValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(
        new I18nValidationExceptionFilter({
            detailedErrors: true
        })
    );

    const configService = app.get<ConfigService>(ConfigService);
    const logLevels = configService.get("LOG_LEVELS")?.split("|") ?? [];
    app.useLogger(logLevels as LogLevel[]);

    
    await app.init();
    request = httpClient(app.getHttpServer());
});

afterAll(async () => {
    await app.close();
});

// add some timeout until containers are up and working 
jest.setTimeout(120000);
export { app, request, moment, TestHelpers };
import { INestApplication, LogLevel } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { ConfigurableTypeOrmModule, DatabaseOptions } from '@kch/domain-n-typeorm';
import { ProjectModuleEntities } from '@src/domain';
import { TypeOrmModule } from "@nestjs/typeorm";
import * as httpClient from 'supertest';

let app: INestApplication;
let request: any | undefined;

beforeAll(async () => {

    process.env.POSTGRES_DATABASE_URL = globalThis.postgresContainer.getConnectionUri();
    process.env.POSTGRES_LOG_ENABLED = "false";
    process.env.LOG_LEVELS = "log";//warn|error";

    initializeTransactionalContext({
        storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot(),
            ConfigurableTypeOrmModule((configService: ConfigService): DatabaseOptions => {
                return {
                    entities: [ ...ProjectModuleEntities ],
                    migrations: [
                        "test/**/migrations/*.ts"
                    ],
                };
            }),
            TypeOrmModule.forFeature([ ...ProjectModuleEntities ])
        ]
    }).compile();

    app = moduleFixture.createNestApplication({
        abortOnError: true,
        bodyParser: true
    });

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
export { app, request };
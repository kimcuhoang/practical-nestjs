import { INestApplication, ValidationPipe, LogLevel } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from '@src/app.module';
// import { ValidationError } from 'class-validator';
// import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
// import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

// let app: INestApplication;
// let connectionString: string;
// let httpServer: any | undefined;

// beforeAll(async () => {

//     connectionString = globalThis.postgresContainer.getConnectionUri();
//     // process.env.POSTGRES_DATABASE_URL = connectionString;
//     // process.env.POSTGRES_LOG_ENABLED = "false";
//     // process.env.FALLBACK_LANGUAGE = "en";
//     // process.env.SOLACE_ENABLED = "false";

//     // if (globalThis.redisEnabled) {

//     //     globalThis.console.log("Redis is enabled");

//     //     const redisUrl = globalThis.redisContainer.getConnectionUrl();

//     //     process.env.REDIS_URL = redisUrl;
//     //     process.env.REDIS_HOST = globalThis.redisContainer.getHost();
//     //     process.env.REDIS_PORT = globalThis.redisContainer.getFirstMappedPort().toString();
//     // }

//     // initializeTransactionalContext({
//     //     storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE
//     // });

//     // const moduleFixture: TestingModule = await Test.createTestingModule({
//     //     imports: [AppModule]
//     // }).compile();

//     // process.env.LOG_LEVELS = "log";//warn|error";

//     // app = moduleFixture.createNestApplication({
//     //     abortOnError: true,
//     //     bodyParser: true
//     // });

//     // // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

//     // app.useGlobalPipes(new I18nValidationPipe());
//     // app.useGlobalFilters(
//     //     new I18nValidationExceptionFilter({
//     //         detailedErrors: true
//     //     })
//     // );

//     // const configService = app.get<ConfigService>(ConfigService);
//     // const logLevels = configService.get("LOG_LEVELS")?.split("|") ?? [];
//     // app.useLogger(logLevels as LogLevel[]);

    
//     // await app.init();
//     // httpServer = app.getHttpServer();
    
//     app = globalThis.nestApp;
//     httpServer = globalThis.nestApp.getHttpServer();
// });

// // afterAll(async () => {
// //     await app.close();
// // });

// // add some timeout until containers are up and working 
// jest.setTimeout(120000);
// export { app, httpServer };

const app = globalThis.nestApp;
const entityManager = globalThis.entityManager;
const httpServer = globalThis.nestApp.getHttpServer();
jest.setTimeout(120000);
export { app, entityManager, httpServer };
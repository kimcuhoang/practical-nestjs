import { INestApplication, ValidationPipe, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';

let app: INestApplication;
let connectionString: string;
let httpServer: any | undefined;

beforeAll(async () => {

    connectionString = globalThis.postgresContainer.getConnectionUri();
    process.env.POSTGRES_DATABASE_URL = connectionString;
    process.env.POSTGRES_LOG_ENABLED = "false";

    process.env.SOLACE_ENABLED = "false";

    if (globalThis.redisEnabled) {

        globalThis.console.log("Redis is enabled");

        const redisUrl = globalThis.redisContainer.getConnectionUrl();

        process.env.REDIS_URL = redisUrl;
        process.env.REDIS_HOST = globalThis.redisContainer.getHost();
        process.env.REDIS_PORT = globalThis.redisContainer.getFirstMappedPort().toString();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
    })
    .compile();

    process.env.LOG_LEVELS = "warn|error";

    app = moduleFixture
        .createNestApplication({
            abortOnError: true,
            bodyParser: true
        })
        .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const configService = app.get<ConfigService>(ConfigService);
    const logLevels = configService.get("LOG_LEVELS")?.split("|") ?? [];
    app.useLogger(logLevels as LogLevel[]);

    await app.init();
    httpServer = app.getHttpServer();
});



afterAll(async () => {
    await app.close();
});

// add some timeout until containers are up and working 
jest.setTimeout(120000);
export { app, httpServer };
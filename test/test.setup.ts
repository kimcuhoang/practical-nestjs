import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';

let app: INestApplication;
let connectionString: string;
let httpServer: any | undefined;

beforeAll(async () => {

    connectionString = globalThis.postgresContainer.getConnectionUri();
    process.env.DATABASE_URL = connectionString;

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

    app = moduleFixture
        .createNestApplication()
        .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();
    httpServer = app.getHttpServer();
    
});



afterAll(async () => {
    await app.close();
});

// add some timeout until containers are up and working 
jest.setTimeout(120000);
export { app, httpServer };
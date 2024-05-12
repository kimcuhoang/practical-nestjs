import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { AppModule } from '@src/app.module';

let postgresContainer: StartedPostgreSqlContainer;
let redisContainer: StartedRedisContainer | undefined;
let app: INestApplication;
let connectionString: string;
let httpServer: any;

global.beforeAll(async () => {

    process.env.RYUK_CONTAINER_IMAGE = "testcontainers/ryuk:0.6.0";

    postgresContainer = await new PostgreSqlContainer("postgres:alpine")
        .withDatabase("practical-nestjs-testing")
        .withUsername("postgres")
        .withPassword("postgres")
        .withNetworkAliases("practical-nestjs-network")
        .withStartupTimeout(50000)
        .start();

    connectionString = postgresContainer.getConnectionUri();

    process.env.DATABASE_URL = connectionString;

    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisUrl = process.env.REDIS_URL;

    const redisIsDisabled = !redisHost || !redisPort || !redisUrl;

    if (!redisIsDisabled) {
        redisContainer = await new RedisContainer("redis:alpine")
            .withNetworkAliases("practical-nestjs-network")
            .withStartupTimeout(50000)
            .start();

        process.env.REDIS_URL = redisContainer.getConnectionUrl();
        process.env.REDIS_HOST = redisContainer.getHost();
        process.env.REDIS_PORT = redisContainer.getPort().toString();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
    .compile();

    app = moduleFixture
        .createNestApplication()
        .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();

    httpServer = app.getHttpServer();
});



global.afterAll(async () => {

    await app.close();

    await postgresContainer.stop({
        timeout: 50000,
        remove: true,
        // removeVolumes: true
    });

    if (redisContainer) {
        await redisContainer.stop({
            timeout: 50000,
            remove: true,
            // removeVolumes: true,
        });
    }
});

// add some timeout until containers are up and working 
jest.setTimeout(120000);
export { app, httpServer, connectionString };
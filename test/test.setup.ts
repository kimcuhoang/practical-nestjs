import { INestApplication } from '@nestjs/common';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedRedisContainer } from '@testcontainers/redis';

let app: INestApplication;
let connectionString: string;
let httpServer: any | undefined;

beforeAll(async () => {

    const postgresContainer = (globalThis.PostgresContainer as StartedPostgreSqlContainer)

    connectionString = postgresContainer.getConnectionUri();

    process.env.DATABASE_URL = connectionString;

    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisUrl = process.env.REDIS_URL;

    const redisIsDisabled = !redisHost || !redisPort || !redisUrl;

    if (!redisIsDisabled) {
        const redisContainer = globalThis.RedisContainer as StartedRedisContainer;

        process.env.REDIS_URL = redisContainer.getConnectionUrl();
        process.env.REDIS_HOST = redisContainer.getHost();
        process.env.REDIS_PORT = redisContainer.getPort().toString();
    }

    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //     imports: [AppModule],
    // })
    // .compile();

    // const app = moduleFixture
    //     .createNestApplication()
    //     .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // await app.init();

    app = globalThis.Application as INestApplication;
    httpServer = app?.getHttpServer();
});



afterAll(async () => {

    // await app.close();

    // await postgresContainer.stop({
    //     timeout: 50000,
    //     remove: true,
    //     // removeVolumes: true
    // });

    // if (redisContainer) {
    //     await redisContainer.stop({
    //         timeout: 50000,
    //         remove: true,
    //         // removeVolumes: true,
    //     });
    // }
});

// add some timeout until containers are up and working 
jest.setTimeout(120000);
export { app, httpServer, connectionString };
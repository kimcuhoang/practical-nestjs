import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { AppModule } from '@src/app.module';
import { Wait } from 'testcontainers';

let postgresContainer: StartedPostgreSqlContainer;
let redisContainer: StartedRedisContainer;
let app: INestApplication;
let connectionString: string;
let httpServer: any;


global.beforeAll(async () => {

    postgresContainer = await new PostgreSqlContainer("postgres:alpine")
            .withDatabase("practical-nestjs-testing")
            .withUsername("postgres")
            .withPassword("postgres")
            .withWaitStrategy(Wait.forListeningPorts())
            .withNetworkAliases("practical-nestjs-network")
            .withStartupTimeout(40000)
            .start();

    redisContainer = await new RedisContainer("redis:alpine")
        .withNetworkAliases("practical-nestjs-network")
        .withStartupTimeout(40000)
        .start();

    connectionString = postgresContainer.getConnectionUri();

    process.env.DATABASE_URL = connectionString;

    process.env.REDIS_URL = redisContainer.getConnectionUrl();
    process.env.REDIS_HOST = redisContainer.getHost();
    process.env.REDIS_PORT = redisContainer.getPort().toString();
    // console.log(`Redis URL: ${process.env.REDIS_URL}`);

    const moduleFixture:TestingModule = await Test.createTestingModule({
        imports: [ AppModule ],
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
    
    await redisContainer.stop({
        timeout: 40000,
        remove: true,
        removeVolumes: true,
    });

    await postgresContainer.stop({
        timeout: 40000,
        remove: true,
        removeVolumes: true
    });
});

// add some timeout until containers are up and working 
jest.setTimeout(120000);
export { app, httpServer, connectionString };
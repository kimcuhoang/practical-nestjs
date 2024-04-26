import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { AppModule } from '@src/app.module';

let postgresContainer: StartedPostgreSqlContainer;
let app: INestApplication;
let connectionString: string;
let httpServer: any;

beforeAll(async () => {

    postgresContainer = await new PostgreSqlContainer("postgres:latest")
            .withDatabase("practical-nestjs-testing")
            .withUsername("postgres")
            .withPassword("postgres")
            .start();

    connectionString = postgresContainer.getConnectionUri();
    process.env.DATABASE_URL = connectionString;

    const moduleFixture:TestingModule = await Test.createTestingModule({
        imports: [ AppModule ]
    })
    .compile();

    app = moduleFixture
        .createNestApplication()
        .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();

    httpServer = app.getHttpServer();
})

afterAll(async () => {
    await postgresContainer.stop({
        timeout:8000,
        remove: true,
        removeVolumes: true
    });
    await app.close();
});

// add some timeout until containers are up and working 
jest.setTimeout(8000);
export { app, httpServer, connectionString };
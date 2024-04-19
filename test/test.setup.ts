import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { AppModule } from '@src/app.module';

let postgresContainer: StartedPostgreSqlContainer;
let postgresClient: Client;
let app: INestApplication;
let connectionString: string;
let httpServer: any;

beforeAll(async () => {

    postgresContainer = await new PostgreSqlContainer("postgres:latest")
        .withDatabase("practical-nestjs-testing")
        .withUsername("postgres")
        .withPassword("postgres")
        .start();

    console.log(postgresContainer.getConnectionUri());

    postgresClient = new Client({
        host: postgresContainer.getHost(),
        port: postgresContainer.getPort(),
        database: postgresContainer.getDatabase(),
        user: postgresContainer.getUsername(),
        password: postgresContainer.getPassword()
    });

    connectionString = `postgresql://${postgresClient.user}:${postgresClient.password}@${postgresClient.host}:${postgresClient.port}/${postgresClient.database}`;

    process.env.DATABASE_URL = connectionString;

    const moduleFixture:TestingModule = await Test.createTestingModule({
        imports: [ AppModule ]
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpServer = app.getHttpServer();
})

afterAll(async () => {
    await postgresContainer.stop();
    await app.close();
});

// add some timeout until containers are up and working 
jest.setTimeout(8000);
export { app, httpServer, connectionString };
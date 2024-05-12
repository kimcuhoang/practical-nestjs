import { INestApplication } from '@nestjs/common';

let app: INestApplication;
let connectionString: string;
let httpServer: any | undefined;

beforeAll(async () => {

    // console.log(process.env.REDIS_URL);
    // console.log(process.env.DATABASE_URL);

    app = globalThis.Application as INestApplication;
    httpServer = app.getHttpServer();
    connectionString = globalThis.ConnectionString;
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
// jest.setTimeout(120000);
export { app, httpServer, connectionString };
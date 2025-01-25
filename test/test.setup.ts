
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupNestApplication } from './test.utils';


let app: INestApplication;
let httpServer: any | undefined;
let httpRequest: any;


beforeAll(async () => {
    app = await setupNestApplication();
    httpServer = app.getHttpServer();
    httpRequest = request(app.getHttpServer());
});

afterAll(async () => {
    await app.close();
});

// add some timeout until containers are up and working 
jest.setTimeout(120000);
export { app, httpServer, httpRequest };
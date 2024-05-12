import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { app, connectionString } from '@test/test.setup';

describe('AppController (e2e)', () => {
    let httpServer: any;

    beforeEach(() => {
        httpServer = app.getHttpServer();
    });

    test('/connection-string (GET)', async () => {
        const response = await request(httpServer).get('/connection-string');

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.text).toBe(connectionString)
        expect(process.env.DATABASE_URL).toBe(connectionString);

        console.log(connectionString);
    });

    test("/redis/ping (GET)", async () => {
        const response = await request(httpServer).get("/redis/ping");

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.text).toBeDefined();
    });

    test("/redis12/ping", async () => {
        const response = await request(httpServer).get("/redis12/ping");

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.text).toBeDefined();
    });
});
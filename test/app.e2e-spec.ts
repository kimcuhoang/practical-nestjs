import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { connectionString, httpServer } from '@test/test.setup';

describe('AppController (e2e)', () => {
    test('/connection-string (GET)', async () => {
        const response = await request(httpServer).get('/connection-string');

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.text).toBe(connectionString)
        expect(process.env.DATABASE_URL).toBe(connectionString);
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
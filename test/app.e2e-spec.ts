import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { httpServer } from '@test/test.setup';

describe('AppController (e2e)', () => {
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
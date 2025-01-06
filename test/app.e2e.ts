import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { httpServer } from '@test/test.setup';

describe('AppController (e2e)', () => {

    test("/redis-ioredis/ping (GET)", async () => {
        const response = await request(httpServer).get("/redis-ioredis/ping");

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.text).toBeDefined();
    });

    test("/redis/ping", async () => {
        const response = await request(httpServer).get("/redis/ping");

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.text).toBeDefined();
    });
});
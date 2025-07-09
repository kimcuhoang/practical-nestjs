import { HttpStatus } from '@nestjs/common';
import { request } from '@test/test.setup';

describe('AppController (e2e)', () => {

    test("/hello", async () => {
        const response = await request.get("/redis-ioredis/ping");
        expect(response.status).toBe(HttpStatus.OK);
    });
});
import { HttpStatus } from '@nestjs/common';
import { request } from './test.setup';

describe('AppController (e2e)', () => {

    test("/hello", async () => {
        await request
            .get("/hello")
            .expect(HttpStatus.OK)
            .expect("Hello World!");
    });
});
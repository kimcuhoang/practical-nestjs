import { HttpStatus } from '@nestjs/common';

describe('AppController (e2e)', () => {

    test("/hello", async () => {
        await global.httpClient
            .get("/hello")
            .expect(HttpStatus.OK)
            .expect("Hello World!");
    });
});
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { httpServer } from '@test/test.setup';
import { ValidationError } from 'class-validator';

describe('AppController (e2e)', () => {

    xtest("/redis-ioredis/ping (GET)", async () => {
        const response = await request(httpServer).get("/redis-ioredis/ping");

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.text).toBeDefined();
    });

    xtest("/redis/ping", async () => {
        const response = await request(httpServer).get("/redis/ping");

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.text).toBeDefined();
    });

    test("say-hi and i18n", async() => {
        const response = await request(httpServer)
                .get("/say-hi")
                // .set({ "x-custom-lang": 'vi' })
                .set({ "x-lang": "vi" })
                .expect(HttpStatus.OK);

        console.log(response.text);
    });

    test.each([
        { projectName: 222 },
        { projectName: "" },
    ])(`validation`, async (payload) => {

        const response = await request(httpServer)
                    .post("/projects")
                    .set("x-lang", "vi")
                    .send(payload)        
                    .expect(HttpStatus.BAD_REQUEST);

        const messages = response.body.message as ValidationError[];
        console.log(messages);
      });
});
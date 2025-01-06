import { HttpStatus } from "@nestjs/common";
import { httpServer } from "@test/test.setup";
import * as request from "supertest";


describe.each(["en", "vi", ""])(`Test translate to`, (code) => {

    test(`[x-custom-lang = ${code}] - Say-hi`, async() => {
        const response = await request(httpServer)
                .get("/say-hi")
                .set({ "x-custom-lang": code })
                .expect(HttpStatus.OK);

        console.log(response.text);
        expect(response.text).toBeTruthy();
    });

    test(`[x-lang = ${code}] - Say-hi`, async() => {
        const response = await request(httpServer)
                .get("/say-hi")
                .set({ "x-custom-lang": code })
                .expect(HttpStatus.OK);

        console.log(response.text);
        expect(response.text).toBeTruthy();
    });

});
import { HttpStatus } from "@nestjs/common";
import { request } from "@test/test.setup";


describe.each(["en", "vi", ""])(`Test translate to`, (code) => {

    test(`[x-custom-lang = ${code}] - Say-hi`, async() => {
        const response = await request
                .get("/say-hi")
                .set({ "x-custom-lang": code })
                .expect(HttpStatus.OK);

        console.log(response.text);
        expect(response.text).toBeTruthy();
    });

    test(`[x-lang = ${code}] - Say-hi`, async() => {
        const response = await request
                .get("/say-hi")
                .set({ "x-custom-lang": code })
                .expect(HttpStatus.OK);

        console.log(response.text);
        expect(response.text).toBeTruthy();
    });

});
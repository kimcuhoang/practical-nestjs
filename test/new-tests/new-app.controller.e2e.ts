import { NewAppController } from "@src/new-sources/new-app.controller";
import { request } from "@test/test.setup";


describe(`${NewAppController.name} E2E Tests`, () => {
    test("should return pong on ping endpoint", async () => {
        const response = await request.get("/new-app/ping");
        expect(response.status).toBe(200);
        expect(response.text).toBe("pong");
    });
});
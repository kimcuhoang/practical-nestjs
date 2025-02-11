import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { request } from "@test/test.setup";


describe("Ability import via CSV", () => {

    test("should be success", async() => {

        const numberOfCodes = faker.number.int({ min: 5, max: 20});
        
        let csvContent = "code\n";

        for(let i = 0; i < numberOfCodes; i++) {
            csvContent += `${faker.string.alphanumeric(10).toUpperCase()}\n`;
        }
        const mockBuffer = Buffer.from(csvContent);

        const response = await request
            .post("/projects/import-csv")
            .set({ "Content-Type": "multipart/form-data" })
            .attach("file", mockBuffer, { filename: "test.csv", contentType: "text/csv" });

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body.projectCodes).toHaveLength(numberOfCodes);
        console.dir(response.body.projectCodes);
    });

});
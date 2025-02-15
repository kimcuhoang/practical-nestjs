import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { request } from "@test/test.setup";


describe("Ability import via CSV", () => {

    test("should be fail if over limit", async() => {
        const sizeInMegabytes = 1.2;
        const targetSizeInBytes = sizeInMegabytes * 1024 * 1024;

        const headers = [ "code" ].toString();
        let currentSize = Buffer.byteLength(headers, "utf-8");
        let content = Buffer.alloc(0, "utf-8");
        content = Buffer.concat([content, Buffer.from(`${headers}\n`, "utf-8")]);

        while(currentSize < targetSizeInBytes) {
            const code = faker.string.alphanumeric(10).toUpperCase();
            content = Buffer.concat([content, Buffer.from(`${code}\n`, "utf-8")]);
            currentSize += Buffer.byteLength(code, "utf-8");
        }

        const response = await request
            .post("/projects/import-csv")
            .set({ "Content-Type": "multipart/form-data" })
            .attach("file", content, { filename: "test.csv", contentType: "text/csv" })
            .expect(HttpStatus.BAD_REQUEST);
    });

    test("should be success", async() => {

        const numberOfCodes = faker.number.int({ min: 5, max: 20});

        const csvRows = [ "code" ];
        
        for(let i = 0; i < numberOfCodes; i++) {
            csvRows.push(faker.string.alphanumeric(10).toUpperCase());
        }

        const mockBuffer = Buffer.from(csvRows.join("\n"), "utf-8");

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
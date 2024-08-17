import * as request from "supertest";
import { faker } from "@faker-js/faker";
import { Repository } from "typeorm";
import { Person } from "@src/people/core";
import { app, httpServer } from "@test/test.setup";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HttpStatus } from "@nestjs/common";
import { Guid } from "guid-typescript";

describe("PeopleController - POST: /people", () => {
    let personRepository: Repository<Person>;

    beforeEach(async() => {
        personRepository = app.get<Repository<Person>>(getRepositoryToken(Person));
    });

    afterEach(async() => {
        await personRepository.delete({});
    });

    test("should be success", async() => {
        const payload = {
            name: faker.person.fullName()
        };

        const response = await request(httpServer).post("/people").send(payload).expect(HttpStatus.CREATED);

        const personId = response.text;

        expect(personId).toBeDefined();
        expect(personId).not.toBe(Guid.EMPTY);
    });
});
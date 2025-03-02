import { Project } from "@src/domain/entities/project";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

import { ulid } from "ulidx";

describe(`Save a new ${Project.name}`, () => {
    let projectRepository: Repository<Project>;

    beforeAll(() => {
        projectRepository = app.get(getRepositoryToken(Project));
    });

    afterEach(async () => {
        await projectRepository.delete({});
    });

    test(`should be success`, async() => {
        const project = new Project(ulid(), { name: "test-project" });
        await projectRepository.save(project);

        const result = await projectRepository.findOne({ where: { id: project.id } });
        expect(result).toEqual(project);
        expect(result.createdAtUtc).toBeTruthy();
        expect(result.updatedAtUtc).toBeTruthy();
    });
});

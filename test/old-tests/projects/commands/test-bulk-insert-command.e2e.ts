import { faker } from "@faker-js/faker";
import { CommandBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Project } from "@src/old-sources/projects/core";
import { BulkInsertProjectPayload, BulkInsertProjectsCommand, UseTransactionWith } from "@src/old-sources/projects/use-cases";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";

describe(`Test ${BulkInsertProjectsCommand.name}`, () => {

    let commandBus: CommandBus;
    let projectRepository: Repository<Project>;
    let payload: BulkInsertProjectPayload[] = [];

    beforeAll(() => {
        commandBus = app.get<CommandBus>(CommandBus);
        projectRepository = app.get(getRepositoryToken(Project));
    });

    beforeEach(() => {
        payload = Array.from({ length: 2 }, () => ({
            projectName: faker.string.alpha(20),
            tasks: Array.from({ length: 2 }, () => faker.string.alpha(20))
        }));
    });
    
    afterEach(async () => {
        await projectRepository.delete({});
    });

    const assertProjects = async () => {
        const savedProjects = await projectRepository.find({
            relations: {
                tasks: true
            }
        });
        expect(savedProjects).toHaveLength(payload.length);

        const savedTasks = savedProjects.flatMap(p => p.tasks);
        expect(savedTasks).toHaveLength(payload.flatMap(p => p.tasks).length);
    };

    test.each<UseTransactionWith>([ "entity-manager", "repository"])("Bulk insert projects using %s", async (upsertType) => {
        const command = new BulkInsertProjectsCommand(upsertType, payload);

        expect(command).toBeDefined();

        const _ = await commandBus.execute(command);

        await assertProjects();
    });
});
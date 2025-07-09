import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Project, Task } from "@src/old-sources/projects/core";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";


describe(`Create ${Project.name} via Repository`, () => {
    let projectRepository: Repository<Project>;

    beforeAll(() => {
        projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
    });

    afterEach(async() => {
        await projectRepository.delete({});
    });

    test(`Repository.save ${Project.name} & its ${Task.name}s`, async() => {
        const project = Project.create(p => {
            p.name = faker.string.alpha(20);
            p.addTask(t => {
                t.name = faker.string.alpha(20);
            });
            p.addTask(t => {
                t.name = faker.string.alpha(20);
            });
        });

        await projectRepository.save(project);

        const savedProject = await projectRepository.findOne({
            where: { id: project.id },
            relations: {
                tasks: true
            }
        });

        expect(savedProject).toBeTruthy();
        expect(savedProject.tasks).toHaveLength(project.tasks.length);
    });
});
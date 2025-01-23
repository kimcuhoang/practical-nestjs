import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Project, Task } from "@src/projects/core";
import { ProjectSchema } from "@src/projects/persistence/schemas/project.schema";
import { TaskSchema } from "@src/projects/persistence/schemas/task.schema";
import { app } from "@test/test.setup";
import { EntityManager, Repository } from "typeorm";


describe("Experiment with bulk insert", () => {
    let projectRepository: Repository<Project>;
    let entityManager: EntityManager;
    let projects: Project[];

    beforeAll(() => {
        projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
        entityManager = app.get<EntityManager>(EntityManager);
    });

    beforeEach(() => {
        projects = Array.from({ length: 2 }, () => Project.create(p => {
            p.name = faker.string.alpha(20);
        }));

        projects.forEach(p => {
            p.addTask(t => {
                t.name = faker.string.alpha(20);
            });
        });
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
        expect(savedProjects).toHaveLength(projects.length);

        const savedTasks = savedProjects.flatMap(p => p.tasks);
        expect(savedTasks).toHaveLength(projects.flatMap(p => p.tasks).length);
    };

    xtest("Bulk insert projects using repository.save", async () => {

        // There are 2 queries
        // 1. Select
        // 2. Insert
        await projectRepository.save(projects);
        await assertProjects();
    });

    test("Bulk insert projects by EntityManger with transaction", async () => {

        // await entityManager.transaction(async transactionalEntityManager => {
        //     await transactionalEntityManager.insert(ProjectSchema, projects);
        //     await transactionalEntityManager.insert(TaskSchema, projects.flatMap(p => p.tasks));
        // });

        await entityManager.transaction(async transactionalEntityManager => {

            await transactionalEntityManager.upsert(ProjectSchema, projects, {
                conflictPaths: ["id"],
                skipUpdateIfNoValuesChanged: true,
                upsertType: "on-duplicate-key-update"
            });

            await transactionalEntityManager.upsert(TaskSchema, projects.flatMap(p => p.tasks), {
                conflictPaths: ["id"],
                skipUpdateIfNoValuesChanged: true,
                upsertType: "on-duplicate-key-update"
            });
        });

        // await entityManager.transaction(async transactionalEntityManager => {

        //     await transactionalEntityManager.getRepository(Project.name).upsert(projects, {
        //         conflictPaths: ["id"],
        //         skipUpdateIfNoValuesChanged: true,
        //         upsertType: "on-duplicate-key-update"
        //     });

        //     await transactionalEntityManager.getRepository(Task.name).upsert(projects.flatMap(p => p.tasks), {
        //         conflictPaths: ["id"],
        //         skipUpdateIfNoValuesChanged: true,
        //         upsertType: "on-duplicate-key-update"
        //     });
        // });

        await assertProjects();
    });

    test("Should rollback if error occurs", async () => {
        try {
            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.getRepository(Project.name).upsert(projects, {
                    conflictPaths: ["id"],
                    skipUpdateIfNoValuesChanged: true,
                    upsertType: "on-duplicate-key-update"
                });

                await transactionalEntityManager.getRepository(Task.name).upsert(projects.flatMap(p => p.tasks), {
                    conflictPaths: ["id"],
                    skipUpdateIfNoValuesChanged: true,
                    upsertType: "on-duplicate-key-update"
                });
                throw new Error("Error occurred");
            });
        } catch (error) {
            console.log(error.message);
        }

        const savedProjects = await projectRepository.find();
        expect(savedProjects).toHaveLength(0);
    });

});
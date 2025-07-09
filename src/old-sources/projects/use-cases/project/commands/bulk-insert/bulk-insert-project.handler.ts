import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BulkInsertProjectsCommand } from "./bulk-insert-project.command";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Project, Task } from "@src/old-sources/projects/core";
import { ProjectSchema } from "@src/old-sources/projects/persistence/schemas/project.schema";
import { TaskSchema } from "@src/old-sources/projects/persistence/schemas/task.schema";
import { Transactional } from "typeorm-transactional";


@CommandHandler(BulkInsertProjectsCommand)
export class BulkInsertProjectHandler implements ICommandHandler<BulkInsertProjectsCommand, void> {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>
    ) {}


    public async execute(command: BulkInsertProjectsCommand): Promise<void> {
        const projects = command.payload.map(p => Project.create(project => {
            project.name = p.projectName;
            p.tasks.forEach(_ => {
                project.addTask(task => {
                    task.name = _;
                });
            });
        }));

        switch (command.upsertType) {
            case "entity-manager": await this.insertByEntityManager(projects); break;
            default: await this.insertByRepository(projects); break;
        }
        return;
    }

    private async insertByEntityManager(projects: Project[]): Promise<void> {

        await this.entityManager.transaction(async transactionalEntityManager => {

            await transactionalEntityManager.getRepository(ProjectSchema).upsert(projects, {
                conflictPaths: ["id"],
                skipUpdateIfNoValuesChanged: true,
                upsertType: "on-duplicate-key-update"
            });

            await transactionalEntityManager.getRepository(TaskSchema).upsert(projects.flatMap(p => p.tasks), {
                conflictPaths: ["id"],
                skipUpdateIfNoValuesChanged: true,
                upsertType: "on-duplicate-key-update"
            });
        });
    }

    @Transactional()
    private async insertByRepository(projects: Project[]): Promise<void> {

        await this.projectRepository.upsert(projects, {
            conflictPaths: ["id"],
            skipUpdateIfNoValuesChanged: true,
            upsertType: "on-duplicate-key-update"
        });

        await this.taskRepository.upsert(projects.flatMap(p => p.tasks), {
            conflictPaths: ["id"],
            skipUpdateIfNoValuesChanged: true,
            upsertType: "on-duplicate-key-update"
        });
    }
}
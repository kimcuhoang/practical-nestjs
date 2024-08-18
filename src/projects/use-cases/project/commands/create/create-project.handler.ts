import { CommandHandler, EventBus, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProjectRequest } from "./create-project.request";
import { Project } from "@src/projects/core";
import { ProjectCreated } from "@src/integration-events/projects/project-created";


@CommandHandler(CreateProjectRequest)
export class CreateProjectHandler implements ICommandHandler<CreateProjectRequest, string> {
    constructor(
        @InjectRepository(Project) private readonly _projectRepository: Repository<Project>,
        private readonly _eventPublisher: EventPublisher,
        private readonly _eventBus: EventBus
    ) {}

    async execute(command: CreateProjectRequest): Promise<string> {
        
        const payload = command.payload;
        const project = Project.create(p => {
            p.name = payload.projectName;
            payload.tasks.forEach(t => {
                p.addTask(_ => {
                    _.name = t.taskName;
                })
            });

        });
        await this._projectRepository.save(project);

        const projectCreated = new ProjectCreated();
        projectCreated.id = project.id;
        projectCreated.name = project.name;
        projectCreated.createdOn = new Date();
        await this._eventBus.publish(projectCreated);

        return project.id;
    }
}
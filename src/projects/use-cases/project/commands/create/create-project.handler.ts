import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProjectRequest } from "./create-project.request";
import { Project } from "@src/projects/core";


@CommandHandler(CreateProjectRequest)
export class CreateProjectHandler implements ICommandHandler<CreateProjectRequest, string> {
    constructor(
        @InjectRepository(Project) 
        private readonly projectRepository: Repository<Project>
    ) {}

    async execute(command: CreateProjectRequest): Promise<string> {
        
        const payload = command.payload;
        const project = Project.create(p => {
            p.name = payload.projectName;
            p.externalMessageId = payload.externalMessageId;
            payload.tasks?.forEach(t => {
                p.addTask(_ => {
                    _.name = t.taskName;
                })
            });

        });
        await this.projectRepository.save(project);
        return project.id;
    }
}
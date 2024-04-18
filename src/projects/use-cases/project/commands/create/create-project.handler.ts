import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProjectRequest } from "./create-project.request";
import { Project } from "@projects/core/project";


@CommandHandler(CreateProjectRequest)
export class CreateProjectHandler implements ICommandHandler<CreateProjectRequest, string> {
    constructor(
        @InjectRepository(Project) private readonly projectRepository: Repository<Project>
    ) {}

    async execute(command: CreateProjectRequest): Promise<string> {
        const project = Project.create(p => {
            p.name = command.payload.name;
        });
        await this.projectRepository.save(project);
        return project.id;
    }
}
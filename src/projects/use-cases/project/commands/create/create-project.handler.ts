import { InjectRepository } from "@nestjs/typeorm";
import { CreateProjectRequest } from "./create-project.request";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Repository } from "typeorm";
import { Project } from "../../../../models/project";

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
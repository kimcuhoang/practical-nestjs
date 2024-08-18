import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { AgileProject } from "@src/agile-board/core";
import { ProjectCreated } from "@src/integration-events/projects/project-created";
import { Repository } from "typeorm";

@EventsHandler(ProjectCreated)
export class ProjectCreatedHandler implements IEventHandler<ProjectCreated>{

    constructor(
        @InjectRepository(AgileProject) private readonly _agileProjectRepository: Repository<AgileProject>
    ){}

    async handle(event: ProjectCreated) {
        const project = AgileProject.create(event.id, p => {
            p.name = event.name
        });

        await this._agileProjectRepository.save(project);
    }

}
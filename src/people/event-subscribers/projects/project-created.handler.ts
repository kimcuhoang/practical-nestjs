import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectCreated } from "@src/integration-events/projects/project-created";
import { AssignmentProject } from "@src/people/core";
import { Repository } from "typeorm";


@EventsHandler(ProjectCreated)
export class ProjectCreatedHandler implements IEventHandler<ProjectCreated> {

    constructor(
        @InjectRepository(AssignmentProject) private readonly _assignmentProjectRepository: Repository<AssignmentProject>
    ){}

    async handle(event: ProjectCreated): Promise<void> {
        const project = AssignmentProject.create(event.id, p => {
            p.name = event.name;
        });
        await this._assignmentProjectRepository.save(project);
    }

}
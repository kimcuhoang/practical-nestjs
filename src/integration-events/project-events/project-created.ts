import { IEvent } from "@nestjs/cqrs";


export class ProjectCreated implements IEvent {
    projectId: string;
    projectName: string;
}
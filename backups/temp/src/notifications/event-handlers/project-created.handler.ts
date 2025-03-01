import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectCreated } from "@integration-events/project-events/project-created";
import { Notification, NotificationChannel, OwnerNotificationType } from "../core";
import { Repository } from "typeorm";

@EventsHandler(ProjectCreated)
export class ProjectCreatedHandler implements IEventHandler<ProjectCreated> {
    
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>
    ){}
    
    async handle(event: ProjectCreated): Promise<any> {

        const notification = Notification.init(_ => {
            _.ownerType = "Project",
            _.ownerIdentity = event.projectId,
            _.ownerNotificationType = OwnerNotificationType.Created,
            _.title = "A new project was created",
            _.content = `A project ${event.projectName} was created`,
            _.notificationChannel = NotificationChannel.Default
        });

        await this.notificationRepository.save(notification);
    }

}
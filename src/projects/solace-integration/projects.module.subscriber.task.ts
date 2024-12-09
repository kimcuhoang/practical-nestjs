import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ProjectsModuleSettings } from "../projects.module.settings";
import { SolaceSubscriber } from "@src/building-blocks/infra/solace";
import { CommandBus } from "@nestjs/cqrs";
import { CreateProjectPayload, CreateProjectRequest } from "../use-cases";

@Injectable()
export class ProjectsModuleSubscriberTask implements OnApplicationBootstrap {
    
    private readonly logger = new Logger(ProjectsModuleSubscriberTask.name);

    constructor(
        private readonly projectsModuleSettings: ProjectsModuleSettings,
        private readonly solaceSubscriber: SolaceSubscriber,
        private readonly commandBus: CommandBus
    ){}
    
    public async onApplicationBootstrap(): Promise<void>{
        if (!this.projectsModuleSettings.enabledSubscribe) {
            this.logger.warn("Disabled subscriber");
            return;
        }

        if (!this.projectsModuleSettings.projectsSolaceQueueName) {
            this.logger.error("The queue's name was not set");
            return;
        }

        const actions: Record<string, (from: string, message: any) => Promise<void>> = {
            [ this.projectsModuleSettings.projectsSolaceQueueName ]: 
                    (from: string, message: any) => this.handleMessage(from, message)
        };

        this.solaceSubscriber.SubscribeQueue(
            this.projectsModuleSettings.projectsSolaceQueueName,
            actions,
            (from: string, message: any) => this.handleMessage(from, message)
        );
    }

    private async handleMessage(from: string, message: any): Promise<void> {

        const createProjectPayload = JSON.parse(message) as CreateProjectPayload;

        if (!createProjectPayload) {
            this.logger.error({
                from,
                message,
                error: "Invalid payload"
            });
            return;
        }

        const command = new CreateProjectRequest(createProjectPayload);
        const projectId = await this.commandBus.execute(command);

        this.logger.log({
            from,
            message,
            projectId
        });
    }
    
}
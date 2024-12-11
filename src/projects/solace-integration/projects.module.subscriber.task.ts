import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ProjectsModuleSettings } from "../projects.module.settings";
import { SolaceModuleSettings, SolaceSubscriber } from "@src/building-blocks/infra/solace";
import { CommandBus } from "@nestjs/cqrs";
import { CreateProjectPayload, CreateProjectRequest } from "../use-cases";
import { Message, MessageConsumerProperties, SolclientFactory } from "solclientjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../core";
import { IsNull, Not, Repository } from "typeorm";


@Injectable()
export class ProjectsModuleSubscriberTask implements OnApplicationBootstrap {

    private readonly logger = new Logger(ProjectsModuleSubscriberTask.name);

    constructor(
        private readonly projectsModuleSettings: ProjectsModuleSettings,
        private readonly solaceModuleSettings: SolaceModuleSettings,
        private readonly solaceSubscriber: SolaceSubscriber,
        private readonly commandBus: CommandBus,
        @InjectRepository(Project) 
        private readonly projectRepository: Repository<Project>
    ) { }

    public onApplicationBootstrap(): Promise<void> {
        if (!this.solaceModuleSettings.enabled){
            this.logger.warn("Solace is disabled");
            return;
        }

        if (!this.projectsModuleSettings.projectsSolaceQueueName) {
            this.logger.error("The queue's name was not set");
            return;
        }

        const configReplay = async (messageConsumerProperties: MessageConsumerProperties): Promise<void> => {
            if (!this.projectsModuleSettings.enabledReplay) {
                this.logger.warn("Disabled replay");
                return;
            }

            const latestProject = await this.projectRepository.findOne({
                where: {
                    externalMessageId: Not(IsNull())
                },
                order: {
                    externalMessageId: 'DESC'
                }
            });

            var latestId = latestProject?.externalMessageId ?? this.projectsModuleSettings.startReplayFromLastMessageId;

            messageConsumerProperties.replayStartLocation = latestId
                        ? SolclientFactory.createReplicationGroupMessageId(latestId)
                        : this.projectsModuleSettings.startReplayFromDatetime
                            ? SolclientFactory.createReplayStartLocationDate(this.projectsModuleSettings.startReplayFromDatetime)
                            : SolclientFactory.createReplayStartLocationBeginning();
        };

        const handleMessage = (message: Message, messageContent: any) => this.handleMessage(message, messageContent);

        this.solaceSubscriber.SubscribeQueue(
            this.projectsModuleSettings.projectsSolaceQueueName,
            configReplay,
            handleMessage
        );
    }

    private async handleMessage(message: Message, messageContent: any): Promise<void> {

        

        const from = message.getDestination().getName();

        const externalMessageId = message.getReplicationGroupMessageId().toString();

        try {
            
            const createProjectPayload = {
                ...JSON.parse(messageContent),
                externalMessageId: externalMessageId
            } as CreateProjectPayload;
            

            const command = new CreateProjectRequest(createProjectPayload);
            const projectId = await this.commandBus.execute(command);

            this.logger.log({
                from,
                projectId
            });

        } catch (error) {
            this.logger.error({
                from,
                error: error.toString()
            });
        }
    }
}
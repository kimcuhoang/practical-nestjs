import { Injectable, Logger } from "@nestjs/common";
import { ProjectsModuleSettings } from "../projects.module.settings";
import { Message, MessageConsumerProperties, SolclientFactory } from "solclientjs";
import { CreateProjectPayload, CreateProjectRequest } from "../use-cases";
import { CommandBus } from "@nestjs/cqrs";
import { SolaceSubscriber } from "@src/building-blocks/infra/solace";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../core";
import { IsNull, Not, Repository } from "typeorm";


@Injectable()
export class ProjectsModuleSubscriber {
    private readonly logger = new Logger(ProjectsModuleSubscriber.name);

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly solaceSubscriber: SolaceSubscriber,
        private readonly projectsModuleSettings: ProjectsModuleSettings,
        private readonly commandBus: CommandBus
    ) { }

    public async startLiveMode(): Promise<void> {

        if (!this.projectsModuleSettings.projectsSolaceQueueName) {
            this.logger.error("The queue's name was not set");
            return;
        }

        this.logger.log("Welcome to Solace Live Mode");

        this.solaceSubscriber.SubscribeQueue(
            this.projectsModuleSettings.projectsSolaceQueueName,
            async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent)
        );
    }

    public async startReplayMode(): Promise<void> {

        if (!this.projectsModuleSettings.projectsSolaceQueueName) {
            this.logger.error("The queue's name was not set");
            return;
        }

        this.logger.log("Welcome to Solace Replay Mode");

        // const latestProject = await this.projectRepository.findOne({
        //     where: {
        //         externalMessageId: Not(IsNull())
        //     },
        //     order: {
        //         externalMessageId: 'DESC'
        //     }
        // });

        // var latestId = latestProject?.externalMessageId ?? this.projectsModuleSettings.startReplayFromLastMessageId;

        this.solaceSubscriber.SubscribeQueue(
            this.projectsModuleSettings.projectsSolaceQueueName,
            async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent),
            (consumerProperties: MessageConsumerProperties) => {

                // consumerProperties.replayStartLocation = latestId
                //     ? SolclientFactory.createReplicationGroupMessageId(latestId)
                //     : this.projectsModuleSettings.startReplayFromDatetime
                //         ? SolclientFactory.createReplayStartLocationDate(this.projectsModuleSettings.startReplayFromDatetime)
                //         : SolclientFactory.createReplayStartLocationBeginning();

                consumerProperties.replayStartLocation = SolclientFactory.createReplayStartLocationBeginning();
            }
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
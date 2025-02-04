import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ProjectsModuleSettings } from "../projects.module.settings";
import { Message, MessageConsumer, MessageConsumerProperties, SolclientFactory } from "solclientjs";
import { CreateProjectPayload, CreateProjectRequest } from "../use-cases";
import { CommandBus } from "@nestjs/cqrs";
import { SolaceModuleSettings, SolaceSubscriber } from "@src/building-blocks/infra/solace";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../core";
import { IsNull, Not, Repository } from "typeorm";


@Injectable()
export class ProjectsModuleSubscriber implements OnApplicationBootstrap {

    private readonly logger = new Logger(ProjectsModuleSubscriber.name);
    private solaceMessageConsumer: MessageConsumer;
    private readonly topics: string[] = [];

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly projectsModuleSettings: ProjectsModuleSettings,
        private readonly commandBus: CommandBus,
        private readonly solaceSubscriber: SolaceSubscriber,
        private readonly solaceModuleSettings: SolaceModuleSettings,
    ) {
        this.projectsModuleSettings.enabledSubscribeTopics
            && this.topics.push(...this.projectsModuleSettings.getTopics());
    }

    onApplicationBootstrap(): void {
        this.switchToLiveMode();
    }

    public switchToLiveMode(): void {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        this.logger.log("Welcome to Solace Live Mode");

        if (this.solaceMessageConsumer && !this.solaceMessageConsumer.disposed) {
            this.solaceMessageConsumer.dispose();
        }

        this.solaceMessageConsumer = this.solaceSubscriber.SubscribeQueue(
            this.projectsModuleSettings.projectsSolaceQueueName,
            this.topics,
            async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent)
        );

        try {
            this.solaceMessageConsumer.connect();
        }
        catch (err) {
            this.logger.error(err);
        }
    }

    public switchToReplay(): void {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn("Solace is disabled");
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

        if (this.solaceMessageConsumer && !this.solaceMessageConsumer.disposed) {
            this.solaceMessageConsumer.dispose();
        }

        this.solaceMessageConsumer = this.solaceSubscriber.SubscribeQueue(
            this.projectsModuleSettings.projectsSolaceQueueName,
            this.topics,
            async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent),
            (consumerProperties: MessageConsumerProperties) => {
                // consumerProperties.replayStartLocation = latestId
                //     ? SolclientFactory.createReplicationGroupMessageId(latestId)
                //     : this.projectsModuleSettings.startReplayFromDatetime
                //         ? SolclientFactory.createReplayStartLocationDate(this.projectsModuleSettings.startReplayFromDatetime)
                //         : SolclientFactory.createReplayStartLocationBeginning();

                consumerProperties.replayStartLocation = SolclientFactory.createReplayStartLocationBeginning();
            });

        try {
            this.solaceMessageConsumer.connect();
        }
        catch (err) {
            this.logger.error(err);
        }
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
                externalMessageId,
                projectId
            });

        } catch (error) {
            this.logger.error({
                from,
                externalMessageId,
                error: error.toString()
            });
        }
    }
}
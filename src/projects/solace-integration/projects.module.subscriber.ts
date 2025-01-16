import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ProjectsModuleSettings } from "../projects.module.settings";
import { Message, MessageConsumerProperties, Session, SolclientFactory } from "solclientjs";
import { CreateProjectPayload, CreateProjectRequest } from "../use-cases";
import { CommandBus } from "@nestjs/cqrs";
import { SolaceSubscriber } from "@src/building-blocks/infra/solace";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../core";
import { IsNull, Not, Repository } from "typeorm";
import { SolaceProvider } from "@src/building-blocks/infra/solace/solace.provider";


@Injectable()
export class ProjectsModuleSubscriber implements OnModuleDestroy {

    private readonly logger = new Logger(ProjectsModuleSubscriber.name);
    private solaceSession: Session;

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly projectsModuleSettings: ProjectsModuleSettings,
        private readonly commandBus: CommandBus,
        private readonly solaceProvider: SolaceProvider,
        private readonly solaceSubscriber: SolaceSubscriber
    ) { }

    onModuleDestroy() {
        this.solaceProvider.disconnect(this.solaceSession);
    }

    public async startLiveMode(): Promise<void> {
        
        this.solaceProvider.disconnect(this.solaceSession);
        
        this.solaceSession = this.solaceProvider.getSolaceSession();

        this.solaceProvider.connect(this.solaceSession, async () => {
            
            this.logger.log("Welcome to Solace Live Mode");

            this.solaceSubscriber.SubscribeQueue(
                this.solaceSession,
                this.projectsModuleSettings.projectsSolaceQueueName,
                async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent)
            );
        });
    }

    public async startReplayMode(): Promise<void> {

        this.solaceProvider.disconnect(this.solaceSession);

        this.solaceSession = this.solaceProvider.getSolaceSession();

        // const latestProject = await this.projectRepository.findOne({
        //     where: {
        //         externalMessageId: Not(IsNull())
        //     },
        //     order: {
        //         externalMessageId: 'DESC'
        //     }
        // });

        // var latestId = latestProject?.externalMessageId ?? this.projectsModuleSettings.startReplayFromLastMessageId;

        this.solaceProvider.connect(this.solaceSession, async () => {

            this.logger.log("Welcome to Solace Replay Mode");

            this.solaceSubscriber.SubscribeQueue(
                this.solaceSession,
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
        });
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
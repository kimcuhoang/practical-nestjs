import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { SolaceSubscriber } from "@src/building-blocks/infra/solace";
import { SolaceProvider } from "@src/building-blocks/infra/solace/solace.provider";
import { Message, MessageConsumerProperties, Session, SolclientFactory } from "solclientjs";
import { BusinessPartnersModuleOptions } from "../business-partners.module.options";


@Injectable()
export class BusinessPatnersModuleSubscriber implements OnModuleDestroy {

    private readonly logger = new Logger(BusinessPatnersModuleSubscriber.name);

    private solaceSession: Session;

    constructor(
        private readonly solaceProvider: SolaceProvider,
        private readonly solaceSubscriber: SolaceSubscriber,
        private readonly options: BusinessPartnersModuleOptions
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
                    this.options.businessPartnerSolaceQueueName,
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
                    this.options.businessPartnerSolaceQueueName,
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

            this.logger.log({
                from: from,
                externalMessageId: externalMessageId
            });
        }
}
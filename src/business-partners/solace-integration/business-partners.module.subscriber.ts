import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { SolaceModuleSettings, SolaceSubscriber } from "@src/building-blocks/infra/solace";
import { Message, MessageConsumer, MessageConsumerProperties, SolclientFactory } from "solclientjs";
import { BusinessPartnersModuleOptions } from "../business-partners.module.options";


@Injectable()
export class BusinessPartnersModuleSubscriber implements OnApplicationBootstrap {

    private readonly logger = new Logger(BusinessPartnersModuleSubscriber.name);
    private solaceMessageConsumer: MessageConsumer;
    private readonly topics: string[] = [];

    constructor(
        private readonly solaceModuleSettings: SolaceModuleSettings,
        private readonly solaceSubscriber: SolaceSubscriber,
        private readonly options: BusinessPartnersModuleOptions
    ) {
        this.options.enabledSubscribeTopics 
        && this.topics.push(...this.options.getTopics());
     }


    onApplicationBootstrap(): void {
        this.startLiveMode();
    }

    public startLiveMode(): void {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        this.logger.log("Welcome to Solace Live Mode");

        if (this.solaceMessageConsumer && !this.solaceMessageConsumer.disposed) {
            this.solaceMessageConsumer.dispose();
        }

        this.solaceMessageConsumer = this.solaceSubscriber.SubscribeQueue(
            this.options.businessPartnerSolaceQueueName,
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

    public startReplayMode(): void {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        this.logger.log("Welcome to Solace Replay Mode");

        if (this.solaceMessageConsumer && !this.solaceMessageConsumer.disposed) {
            this.solaceMessageConsumer.dispose();
        }

        this.solaceMessageConsumer = this.solaceSubscriber.SubscribeQueue(
            this.options.businessPartnerSolaceQueueName,
            this.topics,
            async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent),
            (consumerProperties: MessageConsumerProperties) => {
                consumerProperties.replayStartLocation = SolclientFactory.createReplayStartLocationBeginning();
            }
        );

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

        this.logger.log({
            from: from,
            externalMessageId: externalMessageId,
            message: messageContent
        });
    }
}
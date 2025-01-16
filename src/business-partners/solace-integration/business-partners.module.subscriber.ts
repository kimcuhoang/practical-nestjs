import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { SolaceSubscriber } from "@src/building-blocks/infra/solace";
import { Message, MessageConsumer, MessageConsumerProperties, SolclientFactory } from "solclientjs";
import { BusinessPartnersModuleOptions } from "../business-partners.module.options";


@Injectable()
export class BusinessPatnersModuleSubscriber implements OnApplicationBootstrap {

    private readonly logger = new Logger(BusinessPatnersModuleSubscriber.name);
    private solaceMessageConsumer: MessageConsumer;

    constructor(
        private readonly solaceSubscriber: SolaceSubscriber,
        private readonly options: BusinessPartnersModuleOptions
    ) { }


    onApplicationBootstrap(): void {
        this.startLiveMode();
    }

    public startLiveMode(): void {

        this.logger.log("Welcome to Solace Live Mode");

        if (this.solaceMessageConsumer && !this.solaceMessageConsumer.disposed) {
            this.solaceMessageConsumer.disconnect();
            this.solaceMessageConsumer.dispose();
        }

        this.solaceMessageConsumer = this.solaceSubscriber.SubscribeQueue(
            this.options.businessPartnerSolaceQueueName,
            async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent)
        );
    }

    public startReplayMode(): void {

        this.logger.log("Welcome to Solace Replay Mode");

        if (this.solaceMessageConsumer && !this.solaceMessageConsumer.disposed) {
            this.solaceMessageConsumer.disconnect();
            this.solaceMessageConsumer.dispose();
        }

        this.solaceMessageConsumer = this.solaceSubscriber.SubscribeQueue(
            this.options.businessPartnerSolaceQueueName,
            async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent),
            (consumerProperties: MessageConsumerProperties) => {
                consumerProperties.replayStartLocation = SolclientFactory.createReplayStartLocationBeginning();
            }
        );
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
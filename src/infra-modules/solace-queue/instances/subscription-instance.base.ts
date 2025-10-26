import { Message, MessageConsumer, MessageConsumerProperties, SolclientFactory } from "solclientjs";
import { SolaceReplayRequest } from "./solace-replay.request";
import { SolaceQueueOptions } from "../solace-queue.options";
import { SolaceQueueSubscriber } from "../operators/solace-queue.subscriber";
import { Logger } from "@nestjs/common";
import { ISubscriptionInstanceBootstrap } from "./subscription-instance.bootstrap";


export abstract class SubscriptionInstanceBase implements ISubscriptionInstanceBootstrap {
    protected solaceMessageConsumer: MessageConsumer | null;

    constructor(
        protected readonly solaceQueueOptions: SolaceQueueOptions,
        protected readonly solaceSubscription: SolaceQueueSubscriber,
        protected readonly logger: Logger
    ) { }
    
    protected abstract allowSubscribing(): boolean;
    protected abstract getTopics(): Promise<string[]>;
    protected abstract handleMessage(message: any, messageContent: any): Promise<void>;
    

    public abstract bootstrap(): Promise<void>;
    public abstract startLiveMode(): Promise<void>;
    public abstract startReplayMode(replayRequest?: SolaceReplayRequest): Promise<void>;
    

    protected async doStartLiveMode(queueName: string): Promise<void> {
        if (!this.solaceQueueOptions.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        if (!this.allowSubscribing()) {
            this.logger.warn("Solace - Disabled subscribe");
            return;
        }

        if (this.solaceMessageConsumer && !this.solaceMessageConsumer.disposed) {
            try {
                this.solaceMessageConsumer.disconnect();
            }
            catch (err) {
                this.logger.error(err);
            }
        }

        const topics = await this.getTopics();

        this.solaceMessageConsumer = this.solaceSubscription.SubscribeQueue(
            queueName,
            topics,
            async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent),
        );

        try {
            this.solaceMessageConsumer.connect();
        }
        catch (err) {
            this.logger.error(err);
        }
    }

    protected async doStartReplayMode(queueName: string, replayRequest: SolaceReplayRequest = null): Promise<void> {
        if (!this.solaceQueueOptions.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        if (!this.allowSubscribing()) {
            this.logger.warn("Solace - Disabled subscribe");
            return;
        }

        if (this.solaceMessageConsumer && !this.solaceMessageConsumer.disposed) {
            try {
                this.solaceMessageConsumer.disconnect();
            }
            catch (err) {
                this.logger.error(err);
            }
        }

        const topics = await this.getTopics();

        this.solaceMessageConsumer = this.solaceSubscription.SubscribeQueue(
            queueName,
            topics,
            async (message: Message, messageContent: any) => await this.handleMessage(message, messageContent),
            (consumerProperties: MessageConsumerProperties) => {

                const replayStartLocation = replayRequest?.fromDate
                    ? SolclientFactory.createReplayStartLocationDate(replayRequest.fromDate)
                    : replayRequest?.fromMessageId
                        ? SolclientFactory.createReplicationGroupMessageId(replayRequest.fromMessageId)
                        : SolclientFactory.createReplayStartLocationBeginning();

                this.logger.warn(`Replay request: ${replayStartLocation.toString()}`);

                consumerProperties.replayStartLocation = replayStartLocation;
            }
        );

        try {
            this.solaceMessageConsumer.connect();
        }
        catch (err) {
            this.logger.error(err);
        }
    }
}
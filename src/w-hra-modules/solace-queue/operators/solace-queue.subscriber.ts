
import { Injectable, Logger } from "@nestjs/common";
import {
    Message,
    MessageConsumer,
    MessageConsumerAcknowledgeMode, MessageConsumerEvent, MessageConsumerEventName, MessageConsumerProperties,
    MessageType,
    OperationError,
    QueueDescriptor, QueueType, Session, SolclientFactory
} from "solclientjs";
import { SolaceQueueOptions } from "../solace-queue.options";

@Injectable()
export class SolaceQueueSubscriber {

    private readonly logger = new Logger(SolaceQueueSubscriber.name);

    constructor(
        private readonly options: SolaceQueueOptions,
        private readonly solaceSession: Session
    ) { }

    public SubscribeQueue(queue: string,
        topics: string[],
        messageHandler: (message: Message, messageContent: any) => Promise<void>,
        configReplay?: (consumerProperties: MessageConsumerProperties) => void): MessageConsumer | null {

        if (!this.options.enabled) {
            this.logger.warn('Solace is disabled');
            return null;
        }

        if (!queue) {
            this.logger.error('Queue is empty');
            return null;
        }

        const messageConsumerProperties = this.GetMessageConsumerProperties(QueueType.QUEUE, queue);

        configReplay?.(messageConsumerProperties);

        return this.CreateAndConfigureMessageConsumer(messageConsumerProperties, topics, messageHandler);
    }

    private GetMessageConsumerProperties(queueType: QueueType, endpointName: string): MessageConsumerProperties {

        const messageConsumerProperties = new MessageConsumerProperties();
        messageConsumerProperties.acknowledgeMode = MessageConsumerAcknowledgeMode.CLIENT;
        messageConsumerProperties.createIfMissing = false;
        messageConsumerProperties.queueDescriptor = new QueueDescriptor({
            name: endpointName,
            type: queueType
        });

        messageConsumerProperties.windowSize = this.options.messageConsumerWindowSize;

        return messageConsumerProperties;
    }

    private CreateAndConfigureMessageConsumer(properties: MessageConsumerProperties,
        topics: string[],
        messageHandler: (message: Message, messageContent: any) => Promise<void>): MessageConsumer {

        let messageConsumer = this.solaceSession.createMessageConsumer(properties);

        messageConsumer
            .on(MessageConsumerEventName.CONNECT_FAILED_ERROR, (error: OperationError) => {
                this.logger.error(`CONNECT_FAILED_ERROR ${error.name}: ${error.message}`);
            })
            .on(MessageConsumerEventName.ACTIVE, () => {
                this.logger.warn(`Message Consumer is ACTIVE`);
            })
            .on(MessageConsumerEventName.INACTIVE, () => {
                this.logger.warn(`Message Consumer is INACTIVE`);
            })
            .on(MessageConsumerEventName.GM_DISABLED, () => {
                this.logger.warn(`Message Consumer is GM_DISABLED`);
            })
            .on(MessageConsumerEventName.RECONNECTED, () => {
                this.logger.warn(`Message Consumer is RECONNECTED`);
            })
            .on(MessageConsumerEventName.RECONNECTING, (error: OperationError) => {
                this.logger.error(`Message Consumer is RECONNECTING - ${error.message}`);
            })
            .on(MessageConsumerEventName.SUBSCRIPTION_ERROR, (error: MessageConsumerEvent): void => {
                this.logger.error(`SUBSCRIPTION_ERROR: Delivery of message with correlation key = ${error.correlationKey} rejected`);
            })
            .on(MessageConsumerEventName.SUBSCRIPTION_OK, (event: MessageConsumerEvent): void => {
                this.logger.warn(`SUBSCRIPTION_OK: Delivery of message with correlation key = ${event.correlationKey} successfully`);
            })
            .on(MessageConsumerEventName.UP, (): void => {

                this.logger.warn(`Message Consumer was started - ${messageConsumer.getDestination().toString()}`);

                topics.forEach(topic => {
                    messageConsumer.addSubscription(
                        SolclientFactory.createTopicDestination(topic),
                        topic,
                        10_000 // 10 seconds timeout
                    );
                });
            })
            .on(MessageConsumerEventName.DOWN, (): void => {
                this.logger.warn(`Message Consumer was disconnected`);
                messageConsumer.dispose();
            })
            .on(MessageConsumerEventName.DISPOSED, (): void => {
                this.logger.warn(`Message Consumer was disposed.`);
            })
            .on(MessageConsumerEventName.DOWN_ERROR, (error: OperationError) => {
                switch (error.subcode) {
                    // case ErrorSubcode.REPLAY_STARTED: 
                    // case ErrorSubcode.REPLAY_START_TIME_NOT_AVAILABLE:
                    // case ErrorSubcode.REPLAY_FAILED:
                    // case ErrorSubcode.REPLAY_CANCELLED:
                    // case ErrorSubcode.REPLAY_LOG_MODIFIED:
                    // case ErrorSubcode.REPLAY_MESSAGE_UNAVAILABLE:
                    // case ErrorSubcode.REPLAY_MESSAGE_REJECTED: break;
                    default: this.logger.error(`Received "DOWN_ERROR" event - details: ${error.subcode} - ${error.message}`);
                }
            })
            .on(MessageConsumerEventName.MESSAGE, async (message: Message): Promise<void> => {

                const content = message.getType() === MessageType.TEXT
                    ? message.getSdtContainer()?.getValue()
                    : message.getBinaryAttachment();

                try {
                    await messageHandler(message, content);
                } catch (error) {
                    this.logger.error({
                        Destination: message.getDestination()?.getName(),
                        solaceMessageId: message.getReplicationGroupMessageId()?.toString(),
                        Error: error.toString()
                    });
                } finally {
                    this.options.acknowledgeMessage && message.acknowledge();
                }
            });

        return messageConsumer;
    }
}
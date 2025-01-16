
import { Injectable, Logger } from "@nestjs/common";
import {
    ErrorSubcode,
    Message,
    MessageConsumerAcknowledgeMode, MessageConsumerEvent, MessageConsumerEventName, MessageConsumerProperties,
    MessageType,
    OperationError,
    QueueDescriptor, QueueType, Session, SessionEventCode, SolclientFactory
} from "solclientjs";
import { SolaceModuleSettings } from "./solace.module.settings";

@Injectable()
export class SolaceSubscriber {

    private readonly logger = new Logger(SolaceSubscriber.name);
    
    constructor(
        private readonly solaceModuleSettings: SolaceModuleSettings
    ) { }

    public SubscribeTopics(solaceSession: Session,
                            topics: string[],
                            actions: Record<string, (destination: string, message: any) => Promise<void>>,
                            fallback: (destination: string, message: any) => Promise<void>): void {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn('Solace is disabled');
            return;
        }

        solaceSession.on(SessionEventCode.UP_NOTICE, () => {

            this.logger.log("=== Successfully connected and ready to subscribe. ===");

            topics?.filter(topic => topic).forEach(topic => {
                solaceSession.subscribe(
                    SolclientFactory.createTopicDestination(topic),
                    true,
                    topic,
                    1000);
            });
        });

        solaceSession.on(SessionEventCode.MESSAGE, async (message: Message): Promise<void> => {

            const content = message.getType() === MessageType.TEXT
                ? message.getSdtContainer()?.getValue()
                : message.getBinaryAttachment();

            const destinationName = message.getDestination()?.getName() ?? "";

            const logMessage = `Received message: "${content}" on : ${destinationName}`;

            this.logger.debug(logMessage);

            try {
                const action = actions[destinationName] || fallback;
                await action(destinationName, content);
            } catch (error) {
                this.logger.error(error);
            }
        });
    }

    public async SubscribeQueue(solaceSession: Session,
                                queue: string,
                                messageHandler: (message: Message, messageContent: any) => Promise<void>,
                                configReplay?: (consumerProperties: MessageConsumerProperties) => void) {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn('Solace is disabled');
            return;
        }

        if (!queue) {
            this.logger.error('Queue is empty');
            return;
        }

        const messageConsumerProperties = this.GetMessageConsumerProperties(QueueType.QUEUE, queue);

        configReplay && configReplay(messageConsumerProperties);

        const messageConsumer = await this.CreateAndConfigureMessageConsumer(solaceSession, messageConsumerProperties, messageHandler);

        try {
            messageConsumer.connect();
        } catch (error) {
            this.logger.error(error.toString());
        }
    }

    public async SubscribeTopicEndpoint(solaceSession: Session,
                                        topicEndpoint: string,
                                        configReplay: (consumerProperties: MessageConsumerProperties) => Promise<void>,
                                        messageHandler: (message: Message, messageContent: any) => Promise<void>): Promise<void> {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn('Solace is disabled');
            return;
        }

        if (!topicEndpoint) {
            this.logger.error('Topic-Endpoint is empty');
            return;
        }

        const messageConsumerProperties = this.GetMessageConsumerProperties(QueueType.TOPIC_ENDPOINT, topicEndpoint);

        await configReplay(messageConsumerProperties);

        const messageConsumer = await this.CreateAndConfigureMessageConsumer(solaceSession, messageConsumerProperties, messageHandler);

        try {
            messageConsumer.connect();
        } catch (error) {
            this.logger.error(error.toString());
        }
    }

    private GetMessageConsumerProperties(queueType: QueueType, endpointName: string): MessageConsumerProperties {

        const messageConsumerProperties = new MessageConsumerProperties();
        messageConsumerProperties.acknowledgeMode = MessageConsumerAcknowledgeMode.CLIENT;
        messageConsumerProperties.createIfMissing = false;
        messageConsumerProperties.queueDescriptor = new QueueDescriptor({
            name: endpointName,
            type: queueType
        });

        if (queueType === QueueType.TOPIC_ENDPOINT) {
            messageConsumerProperties.topicEndpointSubscription = SolclientFactory.createTopicDestination(endpointName);
        }

        return messageConsumerProperties;
    }

    private async CreateAndConfigureMessageConsumer(solaceSession: Session, properties: MessageConsumerProperties, messageHandler: (message: Message, messageContent: any) => Promise<void>) {

        const messageConsumer = solaceSession.createMessageConsumer(properties);

        messageConsumer.on(MessageConsumerEventName.SUBSCRIPTION_ERROR, (error: MessageConsumerEvent): void => {
            this.logger.error(`Delivery of message with correlation key = ${error.subcode} rejected, info: ${error.reason}`);
        });

        messageConsumer.on(MessageConsumerEventName.SUBSCRIPTION_OK, (event: MessageConsumerEvent): void => {
            this.logger.debug(`Delivery of message with correlation key = ${event.correlationKey} successfully`);
        });

        messageConsumer.on(MessageConsumerEventName.DOWN_ERROR, (error: OperationError) => {
            switch (error.subcode) {
                case ErrorSubcode.REPLAY_STARTED:
                case ErrorSubcode.REPLAY_START_TIME_NOT_AVAILABLE:
                case ErrorSubcode.REPLAY_FAILED:
                case ErrorSubcode.REPLAY_CANCELLED:
                case ErrorSubcode.REPLAY_LOG_MODIFIED:
                case ErrorSubcode.REPLAY_MESSAGE_UNAVAILABLE:
                case ErrorSubcode.REPLAY_MESSAGE_REJECTED: break;
                default: this.logger.error(`Received "DOWN_ERROR" event - details: ${error}`);
            }
        });

        messageConsumer.on(MessageConsumerEventName.MESSAGE, async (message: Message): Promise<void> => {

            const content = message.getType() === MessageType.TEXT
                ? message.getSdtContainer()?.getValue()
                : message.getBinaryAttachment();


            this.logger.debug({
                applicationMessageId: message.getApplicationMessageId() ?? "nothing",
                replicationGroupMessageId: message.getReplicationGroupMessageId().toString(),
                isRedelivered: message.isRedelivered(),
                // guaranteedMessageId: message.getGuaranteedMessageId(),
                // receiveTimestamp: message.getReceiverTimestamp(),
                // senderId: message.getSenderId(),
                // senderTimestamp: message.getSenderTimestamp(),
                // sequenceNumber: message.getSequenceNumber()
            });

            await messageHandler(message, content);
        });

        return messageConsumer;
    }
}
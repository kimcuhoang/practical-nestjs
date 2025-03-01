
import { Injectable, Logger } from "@nestjs/common";
import {
    ErrorSubcode,
    Message,
    MessageConsumer,
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
        private readonly solaceModuleSettings: SolaceModuleSettings,
        private readonly solaceSession: Session
    ) { }

    public SubscribeTopics(topics: string[],
        actions: Record<string, (destination: string, message: any) => Promise<void>>,
        fallback: (destination: string, message: any) => Promise<void>): void {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn('Solace is disabled');
            return;
        }

        this.solaceSession.on(SessionEventCode.UP_NOTICE, () => {

            this.logger.log("=== Successfully connected and ready to subscribe. ===");

            topics?.filter(topic => topic).forEach(topic => {
                this.solaceSession.subscribe(
                    SolclientFactory.createTopicDestination(topic),
                    true,
                    topic,
                    1000);
            });
        });

        this.solaceSession.on(SessionEventCode.MESSAGE, async (message: Message): Promise<void> => {

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

    public SubscribeQueue(queue: string,
        topics: string[],
        messageHandler: (message: Message, messageContent: any) => Promise<void>,
        configReplay?: (consumerProperties: MessageConsumerProperties) => void): MessageConsumer | null {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn('Solace is disabled');
            return null;
        }

        if (!queue) {
            this.logger.error('Queue is empty');
            return null;
        }

        const messageConsumerProperties = this.GetMessageConsumerProperties(QueueType.QUEUE, queue);

        configReplay && configReplay(messageConsumerProperties);

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

        return messageConsumerProperties;
    }

    private CreateAndConfigureMessageConsumer(properties: MessageConsumerProperties,
                                                topics: string[],
                                                messageHandler: (message: Message, messageContent: any) => Promise<void>): MessageConsumer {

        let messageConsumer = this.solaceSession.createMessageConsumer(properties);

        messageConsumer.on(MessageConsumerEventName.CONNECT_FAILED_ERROR, (error: OperationError) => {
            this.logger.error(`CONNECT_FAILED_ERROR: ${error.message}`);
        });

        messageConsumer.on(MessageConsumerEventName.ACTIVE, () => {
            this.logger.warn(`Message Consumer is ACTIVE`);
        });

        messageConsumer.on(MessageConsumerEventName.INACTIVE, () => {
            this.logger.warn(`Message Consumer is INACTIVE`);
        });

        messageConsumer.on(MessageConsumerEventName.GM_DISABLED, () => {
            this.logger.warn(`Message Consumer is GM_DISABLED`);
        });

        messageConsumer.on(MessageConsumerEventName.RECONNECTED, () => {
            this.logger.warn(`Message Consumer is RECONNECTED`);
        });

        messageConsumer.on(MessageConsumerEventName.RECONNECTING, (error: OperationError) => {
            this.logger.error(`Message Consumer is RECONNECTING - ${error.message}`);
        });

        messageConsumer.on(MessageConsumerEventName.SUBSCRIPTION_ERROR, (error: MessageConsumerEvent): void => {
            this.logger.error(`SUBSCRIPTION_ERROR: Delivery of message with correlation key = ${error.subcode} rejected, info: ${error.reason}`);
        });

        messageConsumer.on(MessageConsumerEventName.SUBSCRIPTION_OK, (event: MessageConsumerEvent): void => {
            this.logger.warn(`SUBSCRIPTION_OK: Delivery of message with correlation key = ${event.correlationKey} successfully`);
        });

        messageConsumer.on(MessageConsumerEventName.UP, (): void => {

            this.logger.warn(`Message Consumer was started - ${messageConsumer.getDestination().toString()}`);

            topics.forEach(topic => {
                messageConsumer.addSubscription(
                    SolclientFactory.createTopicDestination(topic),
                    topic,
                    10_000 // 10 seconds timeout
                );
            });
        });

        messageConsumer.on(MessageConsumerEventName.DOWN, (): void => {
            this.logger.warn(`Message Consumer was disconnected`);
            messageConsumer.dispose();
        });

        messageConsumer.on(MessageConsumerEventName.DISPOSED, (): void => {
            this.logger.warn(`Message Consumer was disposed.`);
        });

        messageConsumer.on(MessageConsumerEventName.DOWN_ERROR, (error: OperationError) => {
            switch (error.subcode) {
                case ErrorSubcode.REPLAY_STARTED:
                    this.logger.error(error.message);
                    const messageConsumerProperties = messageConsumer.getProperties();
                    messageConsumerProperties.replayStartLocation = null;
                    messageConsumer = this.solaceSession.createMessageConsumer(messageConsumerProperties);
                    break;
                // case ErrorSubcode.REPLAY_START_TIME_NOT_AVAILABLE:
                // case ErrorSubcode.REPLAY_FAILED:
                // case ErrorSubcode.REPLAY_CANCELLED:
                // case ErrorSubcode.REPLAY_LOG_MODIFIED:
                // case ErrorSubcode.REPLAY_MESSAGE_UNAVAILABLE:
                // case ErrorSubcode.REPLAY_MESSAGE_REJECTED: break;
                default: this.logger.error(`Received "DOWN_ERROR" event - details: ${error.subcode} - ${error.message}`);
            }
        });

        messageConsumer.on(MessageConsumerEventName.MESSAGE, async (message: Message): Promise<void> => {

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
                this.solaceModuleSettings.acknowledgeMessage && message.acknowledge();
            }
        });

        return messageConsumer;
    }
}
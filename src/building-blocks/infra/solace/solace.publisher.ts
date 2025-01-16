import { Injectable, Logger } from "@nestjs/common";
import { Destination, MessageDeliveryModeType, Session, SolclientFactory } from "solclientjs";
import { SolaceModuleSettings } from "./solace.module.settings";


@Injectable()
export class SolacePublisher {

    private readonly logger = new Logger(SolacePublisher.name);

    constructor(
        private readonly solaceModuleSettings: SolaceModuleSettings,
        private readonly solaceSession: Session
    ){}

    private StartPublishing(destination: Destination, message: any): void
    {
        const messageObj = SolclientFactory.createMessage();

        messageObj.setDestination(destination);
        messageObj.setBinaryAttachment(JSON.stringify(message));
        messageObj.setDeliveryMode(MessageDeliveryModeType.DIRECT);

        this.solaceSession.send(messageObj);
    }

    public PublishQueue(queue: string, message: any) : void
    {
        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn('Solace is disabled');
            return;
        }

        if (!queue) {
            this.logger.error('Queue is empty');
            return;
        }

        const destination = SolclientFactory.createDurableQueueDestination(queue);

        this.StartPublishing(destination, message);
    }

    public PublishTopic(topic: string, message: any): void
    {
        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn('Solace is disabled');
            return;
        }

        if (!topic) {
            this.logger.error('Topic-Endpoint is empty');
            return;
        }

        const destination = SolclientFactory.createTopicDestination(topic);
        this.StartPublishing(destination, message);
    }
}
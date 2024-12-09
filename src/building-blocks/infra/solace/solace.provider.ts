import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { OperationError, RequestError, Session, SessionEvent, SessionEventCode } from "solclientjs";
import { SolaceModuleSettings } from "./solace.module.settings";

@Injectable()
export class SolaceProvider implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(SolaceProvider.name);

    constructor(
        private readonly solaceSession: Session,
        private readonly solaceModuleSettings: SolaceModuleSettings
    ){}

    onModuleInit(): void {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        this.solaceSession.on(SessionEventCode.CONNECT_FAILED_ERROR, (error: OperationError): void => {
            this.logger.error(`Connection failed to the message router: ${error.message} - check correct parameter values and connectivity!`);
        });

        this.solaceSession.on(SessionEventCode.SUBSCRIPTION_ERROR, (error: RequestError): void => {
            this.logger.error(`Cannot add the subscription: ${error.message}`);
        });

        this.solaceSession.on(SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: SessionEvent): void => {
            this.logger.log(`Subscription added successfully: ${sessionEvent.correlationKey}`);
        });
        this.solaceSession.on(SessionEventCode.UP_NOTICE, () => {
            this.logger.log("=== Successfully connected and ready to subscribe. ===");
        });

        this.solaceSession.on(SessionEventCode.DISCONNECTED, () => {
            this.logger.log("Disconnected.");
        });

        //ACKNOWLEDGED MESSAGE implies that the broker has confirmed message receipt
        this.solaceSession.on(SessionEventCode.ACKNOWLEDGED_MESSAGE, (sessionEvent: SessionEvent) => {
            this.logger.log("Delivery of message with correlation key = " + sessionEvent.correlationKey + " confirmed.");
        });

        //REJECTED_MESSAGE implies that the broker has rejected the message
        this.solaceSession.on(SessionEventCode.REJECTED_MESSAGE_ERROR, (error: RequestError) => {
            this.logger.warn("Delivery of message with correlation key = " + error.subcode + " rejected, info: " + error.message);
        });

        //SUBSCRIPTION ERROR implies that there was an error in subscribing on a topic
        this.solaceSession.on(SessionEventCode.SUBSCRIPTION_ERROR, (error : RequestError) => {
            this.logger.error(`Cannot add the subscription: ${error.message}`);
        });

        //SUBSCRIPTION_OK implies that a subscription was successfully applied/removed from the broker
        this.solaceSession.on(SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: SessionEvent) => {
            this.logger.log(`Subscription added successfully: ${sessionEvent.correlationKey}`);
        });

        try {
            this.solaceSession.connect();
        } catch (error) {
            this.logger.error(error.toString());
        }
    }

    onModuleDestroy(): void {
        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }
        this.solaceSession.disconnect();
        this.solaceSession.dispose();
    }
}
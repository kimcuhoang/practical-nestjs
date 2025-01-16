import { Injectable, Logger } from "@nestjs/common";
import { OperationError, RequestError, Session, SessionEvent, SessionEventCode, SessionProperties, SolclientFactory } from "solclientjs";
import { SolaceModuleSettings } from "./solace.module.settings";

@Injectable()
export class SolaceProvider {

    private readonly logger = new Logger(SolaceProvider.name);

    constructor(
        private readonly solaceModuleSettings: SolaceModuleSettings,
        private readonly solaceSessionProperties: SessionProperties
    ) {}

    public getSolaceSession(): Session | null {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn("Solace is disabled");
            return null;
        }

        return SolclientFactory.createSession(this.solaceSessionProperties);
    }

    public disconnect(session: Session): void {

        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        session?.disconnect();
        session?.dispose();
    }

    public connect(session: Session, afterConnected: () => Promise<void>) {
        
        if (!this.solaceModuleSettings.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        session.on(SessionEventCode.CONNECT_FAILED_ERROR, (error: OperationError): void => {
            this.logger.error(`Connection failed to the message router: ${error.message} - check correct parameter values and connectivity!`);
        });

        session.on(SessionEventCode.SUBSCRIPTION_ERROR, (error: RequestError): void => {
            this.logger.error(`Cannot add the subscription: ${error.message}`);
        });

        session.on(SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: SessionEvent): void => {
            this.logger.log(`Subscription added successfully: ${sessionEvent.correlationKey}`);
        });
        session.on(SessionEventCode.UP_NOTICE, async () => {
            this.logger.log("=== Successfully connected and ready to subscribe. ===");
            await afterConnected();
        });

        session.on(SessionEventCode.DISCONNECTED, () => {
            this.logger.log("Disconnected.");
        });

        //ACKNOWLEDGED MESSAGE implies that the broker has confirmed message receipt
        session.on(SessionEventCode.ACKNOWLEDGED_MESSAGE, (sessionEvent: SessionEvent) => {
            this.logger.log("Delivery of message with correlation key = " + sessionEvent.correlationKey + " confirmed.");
        });

        //REJECTED_MESSAGE implies that the broker has rejected the message
        session.on(SessionEventCode.REJECTED_MESSAGE_ERROR, (error: RequestError) => {
            this.logger.warn("Delivery of message with correlation key = " + error.subcode + " rejected, info: " + error.message);
        });

        //SUBSCRIPTION ERROR implies that there was an error in subscribing on a topic
        session.on(SessionEventCode.SUBSCRIPTION_ERROR, (error: RequestError) => {
            this.logger.error(`Cannot add the subscription: ${error.message}`);
        });

        //SUBSCRIPTION_OK implies that a subscription was successfully applied/removed from the broker
        session.on(SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: SessionEvent) => {
            this.logger.log(`Subscription added successfully: ${sessionEvent.correlationKey}`);
        });
        
        try {
            session.connect();
        } catch (error) {
            this.logger.error(error.toString());
        }
    }
}
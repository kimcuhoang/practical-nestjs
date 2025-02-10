import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { OperationError, RequestError, Session, SessionEvent, SessionEventCode } from "solclientjs";
import { SolaceModuleSettings } from "./solace.module.settings";

@Injectable()
export class SolaceProvider implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(SolaceProvider.name);

    constructor(
        private readonly options: SolaceModuleSettings,
        private readonly solaceSession: Session
    ) {}

    onModuleInit(): void {
        
        if (!this.options.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        this.connect();
    }

    onModuleDestroy(): void {

        if (!this.options.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        this.solaceSession.disconnect();
    }

    public connect() {
        
        if (!this.options.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }

        this.solaceSession.on(SessionEventCode.CONNECT_FAILED_ERROR, (error: OperationError): void => {
            this.logger.error(`Connection failed to the message router: ${error.subcode}-${error.message}-${error.reason}`);
        });

        this.solaceSession.on(SessionEventCode.SUBSCRIPTION_ERROR, (error: RequestError): void => {
            this.logger.error(`Cannot add the subscription: ${error.subcode}-${error.message}-${error.reason}`);
        });

        this.solaceSession.on(SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: SessionEvent): void => {
            this.logger.warn(`Subscription added successfully: ${sessionEvent.correlationKey}`);
        });

        this.solaceSession.on(SessionEventCode.UP_NOTICE, () => {
            this.logger.warn("=== Successfully connected and ready to subscribe. ===");
        });

        this.solaceSession.on(SessionEventCode.DISCONNECTED, () => {
            this.logger.warn("Session disconnected.");
            this.solaceSession?.dispose();
        });

        //ACKNOWLEDGED MESSAGE implies that the broker has confirmed message receipt
        this.solaceSession.on(SessionEventCode.ACKNOWLEDGED_MESSAGE, (sessionEvent: SessionEvent) => {
            this.logger.warn("Delivery of message with correlation key = " + sessionEvent.correlationKey + " confirmed.");
        });

        //REJECTED_MESSAGE implies that the broker has rejected the message
        this.solaceSession.on(SessionEventCode.REJECTED_MESSAGE_ERROR, (error: RequestError) => {
            this.logger.error(`Session REJECTED_MESSAGE_ERROR: ${error.subcode}-${error.message}-${error.reason}`);
        });

        this.solaceSession.on(SessionEventCode.DOWN_ERROR, (error: OperationError) => {
            this.logger.error(`Session DOWN_ERROR: ${error.subcode}-${error.reason}-${error.message}`);
        });

        this.solaceSession.on(SessionEventCode.PROVISION_ERROR, () => {
            this.logger.error(`Session PROVISION_ERROR`);
        });

        this.solaceSession.on(SessionEventCode.RECONNECTING_NOTICE, (event: SessionEvent) => {
            this.logger.warn(`Session RECONNECTING_NOTICE: ${event.correlationKey}-${event.errorSubcode}-${event.reason}`);
        });

        this.solaceSession.on(SessionEventCode.RECONNECTED_NOTICE, (event: SessionEvent) => {
            this.logger.warn(`Session RECONNECTED_NOTICE: ${event.correlationKey}-${event.errorSubcode}-${event.reason}`);
        });

        this.solaceSession.on(SessionEventCode.GUARANTEED_MESSAGE_PUBLISHER_DOWN, (error: OperationError) => {
            this.logger.error(`Session GUARANTEED_MESSAGE_PUBLISHER_DOWN: ${error.subcode}-${error.reason}-${error.message}`);
        });

        
        try {
            this.solaceSession.connect();
        } catch (error) {
            this.logger.error(error.toString());
        }
    }
}
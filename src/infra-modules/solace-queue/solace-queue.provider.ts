import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { CapabilityType, OperationError, RequestError, Session, SessionEvent, SessionEventCode } from "solclientjs";
import { SolaceQueueOptions } from "./solace-queue.options";
import { ISubscriptionInstanceBootstrap, SubscriptionInstanceBootstrapsSymbol } from "./instances/subscription-instance.bootstrap";

@Injectable()
export class SolaceQueueProvider implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(SolaceQueueProvider.name);

    constructor(
        private readonly options: SolaceQueueOptions,
        private readonly solaceSession: Session,
        @Inject(SubscriptionInstanceBootstrapsSymbol)
        private readonly instances: ISubscriptionInstanceBootstrap[],
    ) {}

    public onModuleInit(): void {
        if (!this.options.enabled) {
            this.logger.warn("Solace is disabled");
            return;
        }
        this.connect();
    }

    public onModuleDestroy(): void {
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

        this.solaceSession
            .on(SessionEventCode.CONNECT_FAILED_ERROR, (error: OperationError): void => {
                this.logger.error(`Connection failed to the message router: ${error.subcode}-${error.message}-${error.reason}`);
            })
            .on(SessionEventCode.SUBSCRIPTION_ERROR, (error: RequestError): void => {
                this.logger.error(`Cannot add the subscription: ${error.subcode}-${error.message}-${error.reason}`);
            })
            .on(SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: SessionEvent): void => {
                this.logger.warn(`Subscription added successfully: ${sessionEvent.correlationKey}`);
            })
            .on(SessionEventCode.UP_NOTICE, () => {
                this.logger.warn("=== Successfully connected and ready to subscribe. ===");

                if (!this.solaceSession.isCapable(CapabilityType.MESSAGE_REPLAY)) {
                    this.logger.warn('Message Replay is not supported on this message broker, disconnecting...');
                    try {
                        this.solaceSession.disconnect();
                    } catch (error) {
                        this.logger.error(error.toString());
                    }
                    return;
                }
                
                this.instances.forEach(async (bootstrap: ISubscriptionInstanceBootstrap) => {
                    await bootstrap.bootstrap();
                });
            })
            .on(SessionEventCode.DISCONNECTED, () => {
                this.logger.warn("Session disconnected.");
                this.solaceSession?.dispose();
            })
            .on(SessionEventCode.ACKNOWLEDGED_MESSAGE, (sessionEvent: SessionEvent) => {
                this.logger.warn("Delivery of message with correlation key = " + sessionEvent.correlationKey + " confirmed.");
            })
            .on(SessionEventCode.REJECTED_MESSAGE_ERROR, (error: RequestError) => {
                this.logger.error(`Session REJECTED_MESSAGE_ERROR: ${error.subcode}-${error.message}-${error.reason}`);
            })
            .on(SessionEventCode.DOWN_ERROR, (error: OperationError) => {
                this.logger.error(`Session DOWN_ERROR: ${error.subcode}-${error.reason}-${error.message}`);
            })
            .on(SessionEventCode.RECONNECTING_NOTICE, (event: SessionEvent) => {
                this.logger.warn(`Session RECONNECTING_NOTICE: ${event.correlationKey}-${event.errorSubcode}-${event.reason}`);
            })
            .on(SessionEventCode.RECONNECTED_NOTICE, (event: SessionEvent) => {
                this.logger.warn(`Session RECONNECTED_NOTICE: ${event.correlationKey}-${event.errorSubcode}-${event.reason}`);
            })
            .on(SessionEventCode.GUARANTEED_MESSAGE_PUBLISHER_DOWN, (error: OperationError) => {
                this.logger.error(`Session GUARANTEED_MESSAGE_PUBLISHER_DOWN: ${error.subcode}-${error.reason}-${error.message}`);
            });

        
        try {
            this.solaceSession.connect();
        } catch (error) {
            this.logger.error(error.toString());
        }
    }
}
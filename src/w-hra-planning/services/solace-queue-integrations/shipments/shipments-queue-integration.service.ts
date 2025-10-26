import { Injectable, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { SolaceReplayRequest } from "@src/infra-modules/solace-queue/instances/solace-replay.request";
import { SubscriptionInstanceBase } from "@src/infra-modules/solace-queue/instances/subscription-instance.base";
import { SolaceQueueSubscriber } from "@src/infra-modules/solace-queue/operators/solace-queue.subscriber";
import { SolaceQueueOptions } from "@src/infra-modules/solace-queue/solace-queue.options";
import { ShipmentsQueueOptions } from "./shipments-queue.options";
import { CreateShipmentCommand, CreateShipmentPayload } from "@src/w-hra-modules/shipments/use-cases/commands";

@Injectable()
export class ShipmentsQueueIntegrationService extends SubscriptionInstanceBase {
    protected readonly logger: Logger;

    constructor(
        protected readonly solaceQueueOptions: SolaceQueueOptions,
        protected readonly solaceSubscription: SolaceQueueSubscriber,
        private readonly shipmentsQueueOptions: ShipmentsQueueOptions,
        private readonly commandBus: CommandBus
    ) {
        const logger = new Logger(ShipmentsQueueIntegrationService.name);
        super(solaceQueueOptions, solaceSubscription, logger);
        this.logger = logger;
    }

    protected allowSubscribing(): boolean {
        return this.shipmentsQueueOptions.enabledSubscribeFromQueue;
    }

    protected async getTopics(): Promise<string[]> {
        return await Promise.resolve(this.shipmentsQueueOptions.getTopics());
    }

    protected async handleMessage(message: any, messageContent: any): Promise<void> {
        const payload = JSON.parse(messageContent) as CreateShipmentPayload;
        const shipmentId = await this.commandBus.execute(new CreateShipmentCommand(payload));
        this.logger.log(JSON.stringify({
            message: messageContent,
            shipmentId: shipmentId
        }));
    }

    public async bootstrap(): Promise<void> {
        await this.startLiveMode();
    }

    public async startLiveMode(): Promise<void> {
        await this.doStartLiveMode(this.shipmentsQueueOptions.queueName);
        if (this.allowSubscribing()) {
            this.logger.warn("Solace - Shipments - Live Mode");
        }
    }

    public async startReplayMode(replayRequest?: SolaceReplayRequest): Promise<void> {
        await this.doStartReplayMode(this.shipmentsQueueOptions.queueName, replayRequest);
        if (this.allowSubscribing()) {
            this.logger.warn("Solace - Shipments - Replay Mode");
        }
    }

}
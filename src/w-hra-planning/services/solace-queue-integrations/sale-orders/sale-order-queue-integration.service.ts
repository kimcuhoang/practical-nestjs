import { Injectable, Logger } from "@nestjs/common";
import { SubscriptionInstanceBase } from "@src/w-hra-modules/solace-queue/instances/subscription-instance.base";
import { SolaceQueueSubscriber } from "@src/w-hra-modules/solace-queue/operators/solace-queue.subscriber";
import { SolaceQueueOptions } from "@src/w-hra-modules/solace-queue/solace-queue.options";
import { SolaceReplayRequest } from "@src/w-hra-modules/solace-queue/instances/solace-replay.request";
import { SaleOrderQueueOptions } from "./sale-order-queue.options";
import { CommandBus } from "@nestjs/cqrs";
import { CreateSaleOrderCommand, CreateSaleOrderPayload } from "@src/w-hra-modules/sale-orders/use-cases/commands";


@Injectable()
export class SaleOrderQueueIntegrationService extends SubscriptionInstanceBase {
    protected readonly logger: Logger;

    constructor(
        protected readonly solaceQueueOptions: SolaceQueueOptions,
        protected readonly solaceSubscription: SolaceQueueSubscriber,
        private readonly saleOrderQueueOptions: SaleOrderQueueOptions,
        private readonly commandBus: CommandBus
    ) {
        const logger = new Logger(SaleOrderQueueIntegrationService.name);
        super(solaceQueueOptions, solaceSubscription, logger);
        this.logger = logger;
    }

    protected allowSubscribing(): boolean {
        return this.saleOrderQueueOptions.enabledSubscribeFromQueue;
    }

    protected async getTopics(): Promise<string[]> {
        return await Promise.resolve(this.saleOrderQueueOptions.getTopics());
    }

    protected async handleMessage(message: any, messageContent: any): Promise<void> {
        const payload = JSON.parse(messageContent) as CreateSaleOrderPayload;
        const saleOrderId = await this.commandBus.execute(new CreateSaleOrderCommand(payload));
        this.logger.log(JSON.stringify({
            message: messageContent,
            saleOrderId: saleOrderId
        }));
    }

    public async bootstrap(): Promise<void> {
        await this.startLiveMode();
    }

    public async startLiveMode(): Promise<void> {
        await this.doStartLiveMode(this.saleOrderQueueOptions.queueName);
        if (this.allowSubscribing()) {
            this.logger.warn("Solace - SaleOrder - Live Mode");
        }
    }
    public async startReplayMode(replayRequest?: SolaceReplayRequest): Promise<void> {
        await this.doStartReplayMode(this.saleOrderQueueOptions.queueName, replayRequest);
        if (this.allowSubscribing()) {
            this.logger.warn("Solace - SaleOrder - Replay Mode");
        }
    }
}
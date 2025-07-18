import { Injectable, Logger } from "@nestjs/common";
import { SubscriptionInstanceBase } from "@src/w-hra-modules/solace-queue/instances/subscription-instance.base";
import { SolaceQueueSubscriber } from "@src/w-hra-modules/solace-queue/operators/solace-queue.subscriber";
import { SolaceQueueOptions } from "@src/w-hra-modules/solace-queue/solace-queue.options";
import * as stringUtil from "util";
import { SolaceReplayRequest } from "@src/w-hra-modules/solace-queue/instances/solace-replay.request";
import { SaleOrderQueueOptions } from "./sale-order-queue.options";

@Injectable()
export class SaleOrderQueueIntegrationService extends SubscriptionInstanceBase {
    protected readonly logger: Logger;

    constructor(
        protected readonly solaceQueueOptions: SolaceQueueOptions,
        protected readonly solaceSubscription: SolaceQueueSubscriber,
        private readonly saleOrderQueueOptions: SaleOrderQueueOptions,
    ) {
        const logger = new Logger(SaleOrderQueueIntegrationService.name);
        super(solaceQueueOptions, solaceSubscription, logger);
        this.logger = logger;
    }

    protected allowSubscribing(): boolean {
        return this.saleOrderQueueOptions.enabledSubscribeFromQueue;
    }

    protected async getTopics(): Promise<string[]> {
        const topics = !this.saleOrderQueueOptions.enabledSubscribeFromTopics
            ? []
            : this.saleOrderQueueOptions.topicActions
                ?.flatMap(action => {
                    return this.saleOrderQueueOptions.topicTemplates.map(template => stringUtil.format(template.trim(), action.trim()));
                });

        return await Promise.resolve(topics);
    }

    protected async handleMessage(message: any, messageContent: any): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.logger.log(`Received message: ${JSON.stringify(messageContent)}`);
            resolve();
        });
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
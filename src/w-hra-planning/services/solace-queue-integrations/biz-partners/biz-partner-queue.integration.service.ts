import { Injectable, Logger } from "@nestjs/common";
import { SolaceReplayRequest } from "@src/w-hra-modules/solace-queue/instances/solace-replay.request";
import { SubscriptionInstanceBase } from "@src/w-hra-modules/solace-queue/instances/subscription-instance.base";
import { BizPartnerSolaceQueueOptions } from "./biz-partner-queue.options";
import { CommandBus } from "@nestjs/cqrs";
import { SolaceQueueSubscriber } from "@src/w-hra-modules/solace-queue/operators/solace-queue.subscriber";
import { SolaceQueueOptions } from "@src/w-hra-modules/solace-queue/solace-queue.options";
import { plainToInstance } from "class-transformer";
import { BizPartnerPayload, CreateBizPartnerCommand } from "@src/w-hra-modules/biz-partners/use-cases/commands";

@Injectable()
export class BizPartnerQueueIntegrationService extends SubscriptionInstanceBase {
    protected readonly logger: Logger;
    
    constructor(
        protected readonly solaceQueueOptions: SolaceQueueOptions,
        protected readonly solaceSubscription: SolaceQueueSubscriber,
        private readonly bizPartnerQueueOptions: BizPartnerSolaceQueueOptions,
        private readonly commandBus: CommandBus
    ) {
        const logger = new Logger(BizPartnerQueueIntegrationService.name);
        super(solaceQueueOptions, solaceSubscription, logger);
        this.logger = logger;
    }
    
    protected allowSubscribing(): boolean {
        return this.bizPartnerQueueOptions.enabledSubscribeFromQueue;
    }
    protected async getTopics(): Promise<string[]> {
        return await Promise.resolve(this.bizPartnerQueueOptions.getTopics());
    }
    protected async handleMessage(message: any, messageContent: any): Promise<void> {
        const payload = plainToInstance(BizPartnerPayload, JSON.parse(messageContent));
        const bizPartnerId = this.commandBus.execute(new CreateBizPartnerCommand(payload));
        this.logger.log(JSON.stringify({
            message: messageContent,
            bizPartnerId: bizPartnerId
        }));
    }
    public async bootstrap(): Promise<void> {
        await this.startLiveMode();
    }
    public async startLiveMode(): Promise<void> {
        await this.doStartLiveMode(this.bizPartnerQueueOptions.queueName);
        if (this.allowSubscribing()) {
            this.logger.warn("Solace - BizPartner - Live Mode");
        }
    }
    public async startReplayMode(replayRequest?: SolaceReplayRequest): Promise<void> {
        await this.doStartReplayMode(this.bizPartnerQueueOptions.queueName, replayRequest);
        if (this.allowSubscribing()) {
            this.logger.warn("Solace - BizPartner - Replay Mode");
        }
    }
    
}
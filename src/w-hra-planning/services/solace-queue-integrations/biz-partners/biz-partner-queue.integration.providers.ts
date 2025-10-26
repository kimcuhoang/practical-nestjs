import { ConfigService } from "@nestjs/config";
import { BizPartnerQueueIntegrationService } from "./biz-partner-queue.integration.service";
import { BizPartnerSolaceQueueOptions } from "./biz-partner-queue.options";


export const BizPartnerQueueIntegrationProviders = [
    BizPartnerQueueIntegrationService,
    {
        provide: BizPartnerSolaceQueueOptions,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return new BizPartnerSolaceQueueOptions({
                enabledSubscribeFromQueue: configService.get<boolean>("SOLACE_BIZ_PARTNER_QUEUE_ENABLED_SUBSCRIBE_FROM_QUEUE", true),
                enabledRecordMessage: configService.get<boolean>("SOLACE_BIZ_PARTNER_QUEUE_ENABLED_RECORD_MESSAGE", true),
                enabledRecordInvalidMessage: configService.get<boolean>("SOLACE_BIZ_PARTNER_QUEUE_ENABLED_RECORD_INVALID_MESSAGE", true),
                enabledSubscribeFromTopics: configService.get<boolean>("SOLACE_BIZ_PARTNER_QUEUE_ENABLED_SUBSCRIBE_FROM_TOPICS", true),
                queueName: configService.get<string>("SOLACE_BIZ_PARTNER_QUEUE_NAME", "sale-order-queue"),
                topicTemplates: configService.get<string>("SOLACE_BIZ_PARTNER_QUEUE_TOPIC_TEMPLATES")?.split("|")?.filter(template => !!template.trim()) || [],
                topicActions: configService.get<string>("SOLACE_BIZ_PARTNER_QUEUE_TOPIC_ACTIONS")?.split("|")?.filter(action => !!action.trim()) || [],
            });
        }
    }

]
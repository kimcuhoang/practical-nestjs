import { SaleOrderQueueIntegrationService } from "./sale-order-queue-integration.service";
import { SaleOrderQueueOptions } from "./sale-order-queue.options";
import { ConfigService } from "@nestjs/config";


export const SaleOrderQueueIntegrationProviders = [
    SaleOrderQueueIntegrationService, 
    {
        provide: SaleOrderQueueOptions,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return new SaleOrderQueueOptions({
                enabledSubscribeFromQueue: configService.get<boolean>("SOLACE_SALE_ORDER_QUEUE_ENABLED_SUBSCRIBE_FROM_QUEUE", true),
                enabledRecordMessage: configService.get<boolean>("SOLACE_SALE_ORDER_QUEUE_ENABLED_RECORD_MESSAGE", true),
                enabledRecordInvalidMessage: configService.get<boolean>("SOLACE_SALE_ORDER_QUEUE_ENABLED_RECORD_INVALID_MESSAGE", true),
                enabledSubscribeFromTopics: configService.get<boolean>("SOLACE_SALE_ORDER_QUEUE_ENABLED_SUBSCRIBE_FROM_TOPICS", true),
                queueName: configService.get<string>("SOLACE_SALE_ORDER_QUEUE_NAME", "sale-order-queue"),
                topicTemplates: configService.get<string>("SOLACE_SALE_ORDER_QUEUE_TOPIC_TEMPLATES")?.split("|")?.filter(template => !!template.trim()) || [],
                topicActions: configService.get<string>("SOLACE_SALE_ORDER_QUEUE_TOPIC_ACTIONS")?.split("|")?.filter(action => !!action.trim()) || [],
            });
        }
    }
]
import { ConfigService } from "@nestjs/config";
import { ShipmentsQueueIntegrationService } from "./shipments-queue-integration.service";
import { ShipmentsQueueOptions } from "./shipments-queue.options";


export const ShipmentQueueIntegrationProviders = [
    ShipmentsQueueIntegrationService,
    {
        provide: ShipmentsQueueOptions,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return new ShipmentsQueueOptions({
                enabledSubscribeFromQueue: configService.get<boolean>("SOLACE_SHIPMENT_QUEUE_ENABLED_SUBSCRIBE_FROM_QUEUE", true),
                enabledRecordMessage: configService.get<boolean>("SOLACE_SHIPMENT_QUEUE_ENABLED_RECORD_MESSAGE", true),
                enabledRecordInvalidMessage: configService.get<boolean>("SOLACE_SHIPMENT_QUEUE_ENABLED_RECORD_INVALID_MESSAGE", true),
                enabledSubscribeFromTopics: configService.get<boolean>("SOLACE_SHIPMENT_QUEUE_ENABLED_SUBSCRIBE_FROM_TOPICS", true),
                queueName: configService.get<string>("SOLACE_SHIPMENT_QUEUE_NAME", "shipment-queue"),
                topicTemplates: configService.get<string>("SOLACE_SHIPMENT_QUEUE_TOPIC_TEMPLATES")?.split("|")?.filter(template => !!template.trim()) || [],
                topicActions: configService.get<string>("SOLACE_SHIPMENT_QUEUE_TOPIC_ACTIONS")?.split("|")?.filter(action => !!action.trim()) || [],
            });
        }
    }
]
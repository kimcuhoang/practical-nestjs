import { DynamicModule, Module, Provider } from "@nestjs/common";
import { SaleOrdersModule, ShipmentsModule } from "@src/w-hra-modules";
import { SaleOrderCreationValidationService } from "./services";
import { SaleOrderCreationValidationServiceSymbol } from "@src/w-hra-modules/sale-orders/services";
import { SaleOrdersController } from "./controllers/sale-orders.controller";
import { ShipmentsModuleSchemas } from "@src/w-hra-modules/shipments/persistence";
import { SolaceQueueModule } from "@src/w-hra-modules/solace-queue";
import { ISubscriptionInstanceBootstrap, SubscriptionInstanceBootstrapsSymbol } from "@src/w-hra-modules/solace-queue/instances/subscription-instance.bootstrap";
import { SaleOrderQueueIntegrationService } from "./services/solace-queue-integrations/sale-orders/sale-order-queue-integration.service";
import { SaleOrderQueueOptions } from "./services/solace-queue-integrations/sale-orders/sale-order-queue.options";
import { ConfigService } from "@nestjs/config";


@Module({})
export class WhraPlanningModule {
    public static forRoot(): DynamicModule {

        const solaceSubscriptionInstances: any[] = [
            SaleOrderQueueIntegrationService
        ];


        const internalProviders: Provider[] = [
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
        ];

        return {
            module: WhraPlanningModule,
            imports: [
                SolaceQueueModule.forRoot({
                    additionalProviders: [...solaceSubscriptionInstances, ...internalProviders],
                    subscriptionInstances: {
                        provide: SubscriptionInstanceBootstrapsSymbol,
                        inject: [...solaceSubscriptionInstances],
                        useFactory: (...instances: ISubscriptionInstanceBootstrap[]) => instances
                    }
                }),
                SaleOrdersModule.forRoot({
                    additionalSchemas: [
                        ...ShipmentsModuleSchemas
                    ],
                    saleOrderCreationValidationServiceProvider: {
                        provide: SaleOrderCreationValidationServiceSymbol,
                        useClass: SaleOrderCreationValidationService
                    }
                }),
                ShipmentsModule.forRoot()
            ],
            providers: [
                ...solaceSubscriptionInstances,
                ...internalProviders

            ],
            controllers: [
                SaleOrdersController
            ]
        } as DynamicModule;
    }
}

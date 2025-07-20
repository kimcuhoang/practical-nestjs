import { Provider } from "@nestjs/common";
import { ISubscriptionInstanceBootstrap, SubscriptionInstanceBootstrapsSymbol } from "@src/w-hra-modules/solace-queue/instances/subscription-instance.bootstrap";
import { SaleOrderQueueIntegrationService } from "./sale-orders/sale-order-queue-integration.service";
import { SaleOrderQueueIntegrationProviders } from "./sale-orders/sale-order-queue.integration.providers";


export const SolaceQueueIntegrationProviders: Provider[] = [
    ...SaleOrderQueueIntegrationProviders,
    {
        provide: SubscriptionInstanceBootstrapsSymbol,
        inject: [ SaleOrderQueueIntegrationService ],
        useFactory: (...instances: ISubscriptionInstanceBootstrap[]) => instances
    },
];
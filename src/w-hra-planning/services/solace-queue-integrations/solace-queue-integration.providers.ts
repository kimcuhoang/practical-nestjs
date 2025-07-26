import { Provider } from "@nestjs/common";
import { ISubscriptionInstanceBootstrap, SubscriptionInstanceBootstrapsSymbol } from "@src/w-hra-modules/solace-queue/instances/subscription-instance.bootstrap";
import { SaleOrderQueueIntegrationService } from "./sale-orders/sale-order-queue-integration.service";
import { SaleOrderQueueIntegrationProviders } from "./sale-orders/sale-order-queue.integration.providers";
import { ShipmentQueueIntegrationProviders } from "./shipments/shipments-queue.integration.provider";
import { ShipmentsQueueIntegrationService } from "./shipments/shipments-queue-integration.service";
import { BizPartnerQueueIntegrationProviders } from "./biz-partners/biz-partner-queue.integration.providers";
import { BizPartnerQueueIntegrationService } from "./biz-partners/biz-partner-queue.integration.service";


export const SolaceQueueIntegrationProviders: Provider[] = [
    ...SaleOrderQueueIntegrationProviders,
    ...ShipmentQueueIntegrationProviders,
    ...BizPartnerQueueIntegrationProviders,
    {
        provide: SubscriptionInstanceBootstrapsSymbol,
        inject: [ 
            SaleOrderQueueIntegrationService, 
            ShipmentsQueueIntegrationService, 
            BizPartnerQueueIntegrationService 
        ],
        useFactory: (...instances: ISubscriptionInstanceBootstrap[]) => instances
    },
];
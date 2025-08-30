import { DynamicModule, Module } from "@nestjs/common";
import { BizPartnersModule, CustomersModule, SaleOrdersModule, ShipmentsModule } from "@src/w-hra-modules";
import { SaleOrderCreationValidationService } from "./services";
import { SaleOrderCreationValidationServiceSymbol } from "@src/w-hra-modules/sale-orders/services";
import { SaleOrdersController } from "./controllers/sale-orders.controller";
import { ShipmentsModuleSchemas } from "@src/w-hra-modules/shipments/persistence";
import { SolaceQueueModule } from "@src/infra-modules/solace-queue";
import { BizUnitsControllers } from "./controllers/biz-units.controller";
import { SolaceQueueIntegrationProviders } from "./services/solace-queue-integrations/solace-queue-integration.providers";
import { SHIPMENT_ASSIGNMENT_SERVICE } from "@src/w-hra-modules/shipments/services/sale-orders/shipment-assignment-service.interface";
import { shipmentAssignmentService } from "./services/shipments/shipment-assignment.service";
import { ShipmentsController } from "./controllers/shipments.controller";
import { BizPartnersController } from "./controllers/biz-partners.controller";
import { CustomersController } from "./controllers/customers.controller";
import { CqrsEventHandlers } from "./integrations";


@Module({})
export class WhraPlanningModule {
    public static forRoot(): DynamicModule {

        return {
            module: WhraPlanningModule,
            imports: [
                SolaceQueueModule.forRoot({
                    additionalProviders: [ 
                        ...SolaceQueueIntegrationProviders
                    ]
                }),
                SaleOrdersModule.forRoot({
                    additionalSchemas: [
                        ...ShipmentsModuleSchemas
                    ],
                    saleOrderCreationValidationService: {
                        provide: SaleOrderCreationValidationServiceSymbol,
                        useClass: SaleOrderCreationValidationService
                    }
                }),
                ShipmentsModule.forRoot({
                    additionalProviders: [
                        {
                            provide: SHIPMENT_ASSIGNMENT_SERVICE,
                            useClass: shipmentAssignmentService
                        }
                    ]
                }),
                BizPartnersModule.forRoot(),
                CustomersModule.forRoot()
            ],
            providers: [
                ...CqrsEventHandlers
            ],
            controllers: [
                BizUnitsControllers,
                SaleOrdersController,
                ShipmentsController,
                BizPartnersController,
                CustomersController
            ]
        } as DynamicModule;
    }
}

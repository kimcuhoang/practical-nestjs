import { DynamicModule, Module } from "@nestjs/common";
import { BizPartnersModule, BizUnitsModule, CustomersModule, SaleOrdersModule, ShipmentLanesModule, ShipmentsModule } from "@src/w-hra-modules";
import { SaleOrderCreationValidationService, ShipmentKeyGeneratorService } from "./services";
import { SaleOrderCreationValidationServiceSymbol } from "@src/w-hra-modules/sale-orders/services";
import { SaleOrdersController } from "./controllers/sale-orders.controller";
import { ShipmentsModuleSchemas } from "@src/w-hra-modules/shipments/persistence";
import { SolaceQueueModule } from "@src/infra-modules/solace-queue";
import { BizUnitsControllers } from "./controllers/biz-units.controller";
import { SolaceQueueIntegrationProviders } from "./services/solace-queue-integrations/solace-queue-integration.providers";
import { SHIPMENT_ASSIGNMENT_SERVICE } from "@src/w-hra-modules/shipments/services/sale-orders";
import { shipmentAssignmentService } from "./services/shipments/shipment-assignment.service";
import { ShipmentsController } from "./controllers/shipments.controller";
import { BizPartnersController } from "./controllers/biz-partners.controller";
import { CustomersController } from "./controllers/customers.controller";
import { CqrsEventHandlers } from "./integrations";
import { BizUnitsModuleSchemas } from "@src/w-hra-modules/biz-units/persistence";
import { SHIPMENT_KEY_GENERATOR_SYMBOL } from "@src/w-hra-modules/shipments/services/shipment-key-generator";


@Module({})
export class WhraPlanningModule {
    public static forRoot(): DynamicModule {

        return {
            module: WhraPlanningModule,
            global: true,
            imports: [
                BizUnitsModule.forRoot(),
                BizPartnersModule.forRoot(),
                CustomersModule.forRoot(),
                SolaceQueueModule.forRoot({
                    additionalProviders: [
                        ...SolaceQueueIntegrationProviders
                    ]
                }),
                SaleOrdersModule.forRoot({
                    additionalSchemas: [
                        ...BizUnitsModuleSchemas,
                        ...ShipmentsModuleSchemas
                    ],
                    saleOrderCreationValidationService: {
                        provide: SaleOrderCreationValidationServiceSymbol,
                        useClass: SaleOrderCreationValidationService
                    }
                }),
                ShipmentsModule.forRoot({
                    additionalSchemas: [
                        ...BizUnitsModuleSchemas
                    ],
                    additionalProviders: [
                        {
                            provide: SHIPMENT_ASSIGNMENT_SERVICE,
                            useClass: shipmentAssignmentService
                        }
                    ],
                    shipmentKeyGeneratorProvider: {
                        provide: SHIPMENT_KEY_GENERATOR_SYMBOL,
                        useClass: ShipmentKeyGeneratorService
                    }
                }),
                ShipmentLanesModule.forRoot()
                
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

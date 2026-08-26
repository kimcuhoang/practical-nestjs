import { DynamicModule, Module } from "@nestjs/common";
import { BizPartnersModule, BizUnitsModule, CustomersModule, SaleOrdersModule, ShipmentLanesModule, ShipmentsModule } from "@src/w-hra-modules";
import { SaleOrderCreationValidationService } from "./services";
import { SaleOrderCreationValidationServiceSymbol } from "@src/w-hra-modules/sale-orders/services";
import { SaleOrdersController } from "./controllers/sale-orders.controller";
import { ShipmentsModuleSchemas } from "@src/w-hra-modules/shipments/persistence";
import { SolaceQueueModule } from "@src/infra-modules/solace-queue";
import { BizUnitsControllers } from "./controllers/biz-units.controller";
import { SolaceQueueIntegrationProviders } from "./services/solace-queue-integrations/solace-queue-integration.providers";
import { ShipmentsController } from "./controllers/shipments.controller";
import { BizPartnersController } from "./controllers/biz-partners.controller";
import { CustomersController } from "./controllers/customers.controller";
import { CqrsEventHandlers } from "./integrations";
import { BizUnitsModuleSchemas } from "@src/w-hra-modules/biz-units/persistence";
import { overrideShipmentAssigmentServiceProvider, overrideShipmentKeyGeneratorServiceProvider } from "./services/shipments";
import { overrideShipmentLaneKeySettingsServiceProvider } from "./services/shipment-lanes";
import { BizUnitsService } from "./services/biz-units/biz-units.service";


@Module({})
export class WhraPlanningModule {
    public static forRoot(): DynamicModule {

        return {
            module: WhraPlanningModule,
            global: true,
            imports: [
                BizUnitsModule.forRoot({
                    additionalProviders: [ BizUnitsService ],
                    exportProviders: [ BizUnitsService ]
                }),
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
                        ...Object.values(ShipmentsModuleSchemas)
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
                        overrideShipmentAssigmentServiceProvider
                    ],
                    shipmentKeyGeneratorProvider: overrideShipmentKeyGeneratorServiceProvider
                }),
                ShipmentLanesModule.forRoot({
                    shipmentLaneKeySettingsServiceProvider: overrideShipmentLaneKeySettingsServiceProvider
                })
                
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

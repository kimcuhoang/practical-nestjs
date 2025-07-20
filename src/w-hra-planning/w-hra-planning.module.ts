import { DynamicModule, Module } from "@nestjs/common";
import { SaleOrdersModule, ShipmentsModule } from "@src/w-hra-modules";
import { SaleOrderCreationValidationService } from "./services";
import { SaleOrderCreationValidationServiceSymbol } from "@src/w-hra-modules/sale-orders/services";
import { SaleOrdersController } from "./controllers/sale-orders.controller";
import { ShipmentsModuleSchemas } from "@src/w-hra-modules/shipments/persistence";
import { SolaceQueueModule } from "@src/w-hra-modules/solace-queue";
import { BizUnitsControllers } from "./controllers/biz-units.controller";
import { SolaceQueueIntegrationProviders } from "./services/solace-queue-integrations/solace-queue-integration.providers";


@Module({})
export class WhraPlanningModule {
    public static forRoot(): DynamicModule {

        return {
            module: WhraPlanningModule,
            imports: [
                SolaceQueueModule.forRoot({
                    additionalProviders: [ ...SolaceQueueIntegrationProviders ]
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
            controllers: [
                BizUnitsControllers,
                SaleOrdersController
            ]
        } as DynamicModule;
    }
}

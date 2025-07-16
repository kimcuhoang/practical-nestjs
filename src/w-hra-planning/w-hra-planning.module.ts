import { DynamicModule, Module } from "@nestjs/common";
import { SaleOrdersModule, ShipmentsModule } from "@src/w-hra-modules";
import { SaleOrderCreationValidationService } from "./services";
import { SaleOrderCreationValidationServiceSymbol } from "@src/w-hra-modules/sale-orders/services";
import { SaleOrdersController } from "./controllers/sale-orders.controller";
import { ShipmentsModuleSchemas } from "@src/w-hra-modules/shipments/persistence";


@Module({})
export class WhraPlanningModule {
    public static forRoot(): DynamicModule {
        return {
            module: WhraPlanningModule,
            imports: [
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
                SaleOrdersController
            ]
        } as DynamicModule;
    }
}

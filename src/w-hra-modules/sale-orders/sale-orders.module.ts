import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SaleOrderModuleSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./use-cases/commands";
import { DefaultSaleOrderCreationValidationService, ISaleOrderCreationValidationService, SaleOrderCreationValidationServiceSymbol } from "./services";

export type SaleOrdersModuleSettings = {
    additionalSchemas?: any[],
    saleOrderCreationValidationServiceProvider?: Provider<ISaleOrderCreationValidationService>,
};

@Module({})
export class SaleOrdersModule {
    public static forRoot(settings?: SaleOrdersModuleSettings): DynamicModule {
        return {
            module: SaleOrdersModule,
            imports: [
                TypeOrmModule.forFeature([ ...SaleOrderModuleSchemas, ...(settings?.additionalSchemas || []) ])
            ],
            providers: [
                ...CqrsCommandHandlers,
                settings?.saleOrderCreationValidationServiceProvider || {
                    provide: SaleOrderCreationValidationServiceSymbol,
                    useClass: DefaultSaleOrderCreationValidationService
                }
            ],
            exports: [
                TypeOrmModule,
                ...CqrsCommandHandlers
            ]
        } as DynamicModule;
    }
}
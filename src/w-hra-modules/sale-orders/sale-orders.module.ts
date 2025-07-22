import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SaleOrderModuleSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./use-cases/commands";
import { EventHandlers } from "./integrations";
import { CqrsQueryHandlers } from "./use-cases/queries";

export type SaleOrdersModuleSettings = {
    additionalSchemas?: any[],
    additionalProviders?: Provider[],
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
                ...CqrsQueryHandlers,
                ...EventHandlers,
                ...(settings?.additionalProviders || [])
            ],
            exports: [
                TypeOrmModule,
                ...CqrsCommandHandlers,
                ...CqrsQueryHandlers
            ]
        } as DynamicModule;
    }
}
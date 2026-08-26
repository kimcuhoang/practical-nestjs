import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BizUnitsModuleSchemas } from "./persistence";
import { BizUnitsModulesCqrsCommandHandlers } from "./use-cases/commands";
import { queryHandlers } from "./use-cases/queries";

export type BizUnitsModuleSettings = {
    additionalSchemas?: any[],
    additionalProviders?: Provider[],
    exportProviders?: Provider[]
};

@Module({})
export class BizUnitsModule {
    public static forRoot(moduleSettings?: BizUnitsModuleSettings): DynamicModule {
        return {
            module: BizUnitsModule,
            global: true,
            imports: [
                TypeOrmModule.forFeature([
                    ...BizUnitsModuleSchemas,
                    ...(moduleSettings?.additionalSchemas ?? [])
                ])
            ],
            providers: [
                ...BizUnitsModulesCqrsCommandHandlers,
                ...queryHandlers,
                ...(moduleSettings?.additionalProviders ?? [])
            ],
            exports: [
                TypeOrmModule,
                ...BizUnitsModulesCqrsCommandHandlers,
                ...queryHandlers,
                ...(moduleSettings?.exportProviders ?? [])
            ]
        } as DynamicModule;
    }
}
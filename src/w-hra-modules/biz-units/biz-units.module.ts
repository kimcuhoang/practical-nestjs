import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BizUnitsModuleSchemas } from "./persistence";
import { BizUnitsModulesCqrsCommandHandlers } from "./use-cases/commands";

export type BizUnitsModuleSettings = {
    additionalSchemas?: any[],
    additionalProviders?: Provider[],
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
                    ...(moduleSettings?.additionalSchemas || [])
                ])
            ],
            providers: [
                ...BizUnitsModulesCqrsCommandHandlers,
                ...(moduleSettings?.additionalProviders || [])
            ],
            exports: [
                TypeOrmModule,
                ...BizUnitsModulesCqrsCommandHandlers
            ]
        } as DynamicModule;
    }
}
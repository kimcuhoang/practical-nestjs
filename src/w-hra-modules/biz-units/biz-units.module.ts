import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BizUnitsModuleSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./use-cases/commands";

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
                ...CqrsCommandHandlers,
                ...(moduleSettings?.additionalProviders || [])
            ],
            exports: [
                TypeOrmModule,
                ...CqrsCommandHandlers
            ]
        } as DynamicModule;
    }
}
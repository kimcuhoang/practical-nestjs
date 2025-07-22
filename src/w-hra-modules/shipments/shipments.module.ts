import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShipmentsModuleSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./use-cases/commands";

export type ShipmentsModuleSettings = {
    additionalSchemas?: any[],
    additionalProviders?: Provider[],
};

@Module({})
export class ShipmentsModule {
    public static forRoot(settings?: ShipmentsModuleSettings): DynamicModule {
        return {
            module: ShipmentsModule,
            imports: [
                TypeOrmModule.forFeature([
                    ...ShipmentsModuleSchemas,
                    ...(settings?.additionalSchemas || [])
                ])
            ],
            providers: [
                ...CqrsCommandHandlers,
                ...(settings?.additionalProviders || [])
            ],
            exports: [
                TypeOrmModule,
                ...CqrsCommandHandlers
            ]
        } as DynamicModule;
    }
}
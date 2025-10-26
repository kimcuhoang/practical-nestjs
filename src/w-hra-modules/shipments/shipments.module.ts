import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShipmentsModuleSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./use-cases/commands";
import { defaultShipmentKeyGeneratorProvider, IShipmentKeyGenerator, SHIPMENT_KEY_GENERATOR_SYMBOL } from "./services/shipment-key-generator";

export type ShipmentsModuleSettings = {
    additionalSchemas?: any[],
    additionalProviders?: Provider[],
    shipmentKeyGeneratorProvider?: Provider<IShipmentKeyGenerator>
};

@Module({})
export class ShipmentsModule {
    public static forRoot(settings?: ShipmentsModuleSettings): DynamicModule {
        return {
            module: ShipmentsModule,
            global: true,
            imports: [
                TypeOrmModule.forFeature([
                    ...Object.values(ShipmentsModuleSchemas),
                    ...(settings?.additionalSchemas || [])
                ])
            ],
            providers: [
                ...CqrsCommandHandlers,
                ...(settings?.additionalProviders || []),
                settings?.shipmentKeyGeneratorProvider ?? defaultShipmentKeyGeneratorProvider
            ],
            exports: [
                TypeOrmModule,
                ...CqrsCommandHandlers,
                SHIPMENT_KEY_GENERATOR_SYMBOL
            ]
        } as DynamicModule;
    }
}
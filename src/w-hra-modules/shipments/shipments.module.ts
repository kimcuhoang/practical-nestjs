import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShipmentsModuleSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./use-cases/commands";
import { DefaultShipmentKeyGenerator, IShipmentKeyGenerator, SHIPMENT_KEY_GENERATOR_SYMBOL } from "./services/shipment-key-generator";

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
            imports: [
                TypeOrmModule.forFeature([
                    ...ShipmentsModuleSchemas,
                    ...(settings?.additionalSchemas || [])
                ])
            ],
            providers: [
                ...CqrsCommandHandlers,
                ...(settings?.additionalProviders || []),
                settings?.shipmentKeyGeneratorProvider || {
                    provide: SHIPMENT_KEY_GENERATOR_SYMBOL,
                    useClass: DefaultShipmentKeyGenerator
                }
            ],
            exports: [
                TypeOrmModule,
                ...CqrsCommandHandlers,
                SHIPMENT_KEY_GENERATOR_SYMBOL
            ]
        } as DynamicModule;
    }
}
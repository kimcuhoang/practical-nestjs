import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShipmentLanesModuleEntitySubscribers, ShipmentLanesModuleSchemas } from "./persistence";
import { defaultShipmentKeyGeneratorProvider } from "../shipments/services/shipment-key-generator";
import { IShipmentLaneKeySettingsService } from "./services/shipment-lane-key-settings";

export type ShipmentLanesModuleSettings = {
    shipmentLaneKeySettingsServiceProvider?: Provider<IShipmentLaneKeySettingsService>
};

@Module({})
export class ShipmentLanesModule {
    public static forRoot(settings?: ShipmentLanesModuleSettings): DynamicModule {
        return {
            module: ShipmentLanesModule,
            global: true,
            imports: [
                TypeOrmModule.forFeature([
                    ...Object.values(ShipmentLanesModuleSchemas)
                ])
            ],
            providers: [
                ...Object.values(ShipmentLanesModuleEntitySubscribers),
                settings?.shipmentLaneKeySettingsServiceProvider ?? defaultShipmentKeyGeneratorProvider
            ],
            exports: [
                TypeOrmModule
            ]
        } as DynamicModule;
    }
}
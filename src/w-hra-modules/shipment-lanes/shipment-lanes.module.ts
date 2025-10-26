import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShipmentLanesModuleEntitySubscribers, ShipmentLanesModuleSchemas } from "./persistence";


@Module({})
export class ShipmentLanesModule {
    public static forRoot(): DynamicModule {
        return {
            module: ShipmentLanesModule,
            global: true,
            imports: [
                TypeOrmModule.forFeature([
                    ...Object.values(ShipmentLanesModuleSchemas)
                ])
            ],
            providers: [
                ...Object.values(ShipmentLanesModuleEntitySubscribers)
            ],
            exports: [
                TypeOrmModule
            ]
        } as DynamicModule;
    }
}
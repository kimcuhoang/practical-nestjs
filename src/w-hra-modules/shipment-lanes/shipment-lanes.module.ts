import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShipmentLanesModuleSchemas } from "./persistence";


@Module({})
export class ShipmentLanesModule {
    public static forRoot(): DynamicModule {
        return {
            module: ShipmentLanesModule,
            global: true,
            imports: [
                TypeOrmModule.forFeature([
                    ...ShipmentLanesModuleSchemas
                ])
            ],
            providers: [],
            exports: [
                TypeOrmModule
            ]
        } as DynamicModule;
    }
}
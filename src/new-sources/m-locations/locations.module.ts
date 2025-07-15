import { DynamicModule, Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationSchemas } from "./persistence";


@Global()
@Module({})
export class LocationsModule {
    public static register(): DynamicModule {
        return {
            module: LocationsModule,
            imports: [
                TypeOrmModule.forFeature([
                    ...LocationSchemas
                ])
            ],
            exports: [
                TypeOrmModule
            ]
        }
    }
}
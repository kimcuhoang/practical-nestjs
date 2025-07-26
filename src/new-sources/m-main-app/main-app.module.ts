import { DynamicModule, Global, Module } from "@nestjs/common";
import { LocationsModule } from "../m-locations/locations.module";


@Global()
@Module({})
export class MainAppModule {
    public static register(): DynamicModule {

        
        const locationsModule = LocationsModule.register();

        return {
            module: MainAppModule,
            imports: [
                locationsModule
            ]
        }
    }
}
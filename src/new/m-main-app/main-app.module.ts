import { DynamicModule, Global, Module } from "@nestjs/common";
import { BizPartnersModule } from "../m-biz-partners/biz-partners.module";
import { LocationsModule } from "../m-locations/locations.module";


@Global()
@Module({})
export class MainAppModule {
    public static register(): DynamicModule {

        const bizPartnersModule = BizPartnersModule.register();
        const locationsModule = LocationsModule.register();

        return {
            module: MainAppModule,
            imports: [
                bizPartnersModule,
                locationsModule
            ]
        }
    }
}
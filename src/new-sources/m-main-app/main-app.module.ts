import { DynamicModule, Global, Module } from "@nestjs/common";
import { BizPartnersModule } from "../m-biz-partners/biz-partners.module";
import { LocationsModule } from "../m-locations/locations.module";
import { CustomBizPartnerVerificationService } from "./services/custom-biz-partner-verification.service";
import { IBizPartnerVerificationService, IBizPartnerVerificationServiceSymbol } from "../m-biz-partners/services/biz-partner-verification.service";


@Global()
@Module({})
export class MainAppModule {
    public static register(): DynamicModule {

        const bizPartnersModule = BizPartnersModule.register({
            bizPartnerVerificationService: {
                provide: IBizPartnerVerificationServiceSymbol,
                useClass: CustomBizPartnerVerificationService
            }
        });
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
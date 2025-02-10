import { DynamicModule, Module } from "@nestjs/common";
import { BusinessPatnersModuleSubscriber } from "./solace-integration/business-partners.module.subscriber";
import { BusinessPartnersSolaceController } from "./controllers/business-partners.solace.controller";
import { ConfigService } from "@nestjs/config";
import { BusinessPartnersModuleOptions } from "./business-partners.module.options";


@Module({})
export class BusinessPartnersModule {
    public static register(configure: (configService: ConfigService) => BusinessPartnersModuleOptions) : DynamicModule {
        return {
            module: BusinessPartnersModule,
            providers: [ 
                BusinessPatnersModuleSubscriber,
                {
                    provide: BusinessPartnersModuleOptions,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService): BusinessPartnersModuleOptions => {
                        return configure(configService);
                    }
                }
            ],
            controllers: [
                BusinessPartnersSolaceController
            ]
        }
    }
}
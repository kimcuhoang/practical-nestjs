import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BizPartnerSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./usecases/commands";
import { IBizPartnerVerificationService, BizPartnerVerificationService, IBizPartnerVerificationServiceSymbol } from "./services/biz-partner-verification.service";

export type BizPartnersModuleOptions = {
    bizPartnerVerificationService?: Provider<IBizPartnerVerificationService>;
};

@Global()
@Module({})
export class BizPartnersModule {
    public static register(options?: BizPartnersModuleOptions): DynamicModule {
        const providers: Provider[] = [ 
            ...CqrsCommandHandlers,
            options?.bizPartnerVerificationService || {
                provide: IBizPartnerVerificationServiceSymbol,
                useClass: BizPartnerVerificationService
            }
        ]

        return {
            module: BizPartnersModule,
            imports: [
                TypeOrmModule.forFeature([...BizPartnerSchemas])
            ],
            providers: providers,
            exports: [
                TypeOrmModule
            ]
        }
    }
}
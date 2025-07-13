import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BizPartnerSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./usecases/commands";
import { BizPartnerVerificationService, BizPartnerVerificationServiceSymbol } from "./services/biz-partner-verification.service";

@Global()
@Module({})
export class BizPartnersModule {
    public static register(): DynamicModule {
        const providers: Provider[] = [ 
            ...CqrsCommandHandlers,
            {
                provide: BizPartnerVerificationServiceSymbol,
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
import { DynamicModule, Module } from "@nestjs/common";
import { BizPartnersModuleSchemas } from "./persistence";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BizPartnersModuleCommandHandlers } from "./use-cases/commands";


@Module({})
export class BizPartnersModule {
    public static forRoot(): DynamicModule {

        return {
            module: BizPartnersModule,
            imports: [
                TypeOrmModule.forFeature([...BizPartnersModuleSchemas])
            ],
            providers: [
                ...BizPartnersModuleCommandHandlers
            ],
            exports: [
                TypeOrmModule,
                ...BizPartnersModuleCommandHandlers
            ]
        } as DynamicModule;
    }
}
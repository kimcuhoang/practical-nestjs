import { Global, Module } from "@nestjs/common";
import { NewAppController } from "./new-app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BizPartnerSchemas } from "./m-biz-partners/persistence";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([...BizPartnerSchemas])
    ],
    exports: [
        TypeOrmModule
    ],
    controllers: [NewAppController]
})
export class NewAppModule {}
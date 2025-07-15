import { Global, Module } from "@nestjs/common";
import { NewAppController } from "./new-app.controller";
import { MainAppModule } from "./m-main-app/main-app.module";
import { TariffsModule } from "./tariffs";

@Global()
@Module({
    imports: [
        MainAppModule.register(),
        TariffsModule
    ],
    exports: [
    ],
    controllers: [NewAppController]
})
export class NewAppModule {}
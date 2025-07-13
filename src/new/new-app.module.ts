import { Global, Module } from "@nestjs/common";
import { NewAppController } from "./new-app.controller";
import { MainAppModule } from "./m-main-app/main-app.module";

@Global()
@Module({
    imports: [
        MainAppModule.register()
    ],
    exports: [
    ],
    controllers: [NewAppController]
})
export class NewAppModule {}
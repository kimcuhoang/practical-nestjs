import { Module } from "@nestjs/common";
import { NewAppController } from "./new-app.controller";

@Module({
    controllers: [NewAppController]
})
export class NewAppModule {}
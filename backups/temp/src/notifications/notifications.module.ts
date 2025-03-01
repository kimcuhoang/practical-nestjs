import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsEventHandler } from "./event-handlers";
import { NotificationsModuleSchemas } from "./persistence";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([...NotificationsModuleSchemas])
    ],
    providers: [
        ...NotificationsEventHandler
    ]
})
export class NotificationsModule {}
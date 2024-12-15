import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsModuleSchemas } from "./persistence";
import { NotificationsEventHandler } from "./event-handlers";

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
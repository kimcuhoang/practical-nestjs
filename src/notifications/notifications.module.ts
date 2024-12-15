import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsModuleSchemas } from "./persistence";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([...NotificationsModuleSchemas])
    ]
})
export class NotificationsModule {}
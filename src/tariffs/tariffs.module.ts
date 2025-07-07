import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TariffSchemas } from "./persistence";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            ...TariffSchemas
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [
        TypeOrmModule
    ],
})
export class TariffsModule {}
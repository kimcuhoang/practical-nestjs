import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import PeopleModuleSchemas from "./persistence";
import PeopleModuleHandlers from "./use-cases";
import { PeopleController } from "./people.controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([...PeopleModuleSchemas])
    ],
    providers: [ ...PeopleModuleHandlers ],
    controllers: [ PeopleController ]
})
export class PeopleModule {}
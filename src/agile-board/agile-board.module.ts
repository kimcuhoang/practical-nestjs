import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PeopleModule } from "@src/people";
import { ProjectsModule } from "@src/projects";
import AgileBoardModuleSchemas from "./persistence";
import EventHandlers from "./event-subscribers";

@Module({
    imports: [
        TypeOrmModule.forFeature(AgileBoardModuleSchemas),
        PeopleModule,
        ProjectsModule
    ],
    providers: [
        ...EventHandlers
    ]
})
export class AgileBoardModule {}
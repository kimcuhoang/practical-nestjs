import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PeopleModule } from "@src/people";
import { ProjectsModule } from "@src/projects";
import AgileBoardModuleSchemas from "./persistence";

@Module({
    imports: [
        TypeOrmModule.forFeature(AgileBoardModuleSchemas),
        PeopleModule,
        ProjectsModule
    ]
})
export class AgileBoardModule {}
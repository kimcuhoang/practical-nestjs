import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProjectsModuleSchemas from './persistence';
import ProjectsModuleHandlers  from './use-cases';

@Module({
    imports: [
        TypeOrmModule.forFeature([...ProjectsModuleSchemas])
    ],
    providers: [ ...ProjectsModuleHandlers ],
    controllers: [ ProjectsController ]
})

export class ProjectsModule {}
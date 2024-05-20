import { Global, Module } from '@nestjs/common';
import { Handlers } from './use-cases';
import { ProjectsController } from './projects.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModuleDataSource } from './persistence';

@Global()
@Module({
    imports: [
        CqrsModule, 
        TypeOrmModule.forFeature([...ProjectsModuleDataSource.Schemas])
    ],
    providers: [ ...Handlers ],
    controllers: [ProjectsController]
})

export class ProjectsModule {}
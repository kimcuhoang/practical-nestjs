import { Global, Module } from '@nestjs/common';
import { CommandHandlers, QueryHandlers } from './use-cases';
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
    providers: [
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [ProjectsController]
})

export class ProjectsModule {}
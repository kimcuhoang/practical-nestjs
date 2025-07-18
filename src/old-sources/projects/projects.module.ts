import { Global, Module } from '@nestjs/common';
import { Handlers } from './use-cases';
import { ProjectsController } from './controllers/projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModuleSchemas } from './persistence';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([...ProjectsModuleSchemas])
    ],
    providers: [ 
        ...Handlers
    ],
    controllers: [ProjectsController]
})

export class ProjectsModule {}
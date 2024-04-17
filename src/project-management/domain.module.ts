import { Global, Module } from '@nestjs/common';
import { CommandHandlers, QueryHandlers } from './use-cases';
import { DomainController } from './domain.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectSchema } from './schemas/project.schema';

@Global()
@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([ProjectSchema])],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [DomainController]
})
export class DomainModule {}

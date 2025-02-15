import { Global, Module } from '@nestjs/common';
import { Handlers } from './use-cases';
import { ProjectsController } from './controllers/projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModuleSettings } from './projects.module.settings';
import { ConfigService } from '@nestjs/config';
import { ProjectsModuleSchemas } from './persistence';
import { ProjectsSolaceController } from './controllers/projects-solace.controller';
import { ProjectsModuleSubscriber } from './solace-integration/projects.module.subscriber';
import { FileValidatorService } from '../building-blocks/services/file-validator.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([...ProjectsModuleSchemas])
    ],
    providers: [ 
        ...Handlers,
        FileValidatorService,
        ProjectsModuleSubscriber,
        {
            provide: ProjectsModuleSettings,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new ProjectsModuleSettings({
                    projectsSolaceQueueName: configService.get("SOLACE_PROJECTS_QUEUE"),
                    topicCRT: configService.get("SOLACE_PROJECTS_QUEUE_TOPIC_CRT"),
                    topicUPD: configService.get("SOLACE_PROJECTS_QUEUE_TOPIC_UPD"),
                    topicCNL: configService.get("SOLACE_PROJECTS_QUEUE_TOPIC_CNL"),
                    enabledSubscribe: configService.get("SOLACE_PROJECTS_QUEUE_SUBSCRIBE_ENABLED")?.toLowerCase() === 'true',
                    enabledSubscribeTopics: configService.get("SOLACE_PROJECTS_QUEUE_ENABLED_SUBSCRIBE_TOPICS")?.toLowerCase() === 'true',
                    limitUploadFileSizeInMB: configService.get<number>("LIMIT_UPLOAD_FILE_SIZE_IN_MB") ?? 10
                });
            }
        }
    ],
    controllers: [ProjectsController, ProjectsSolaceController]
})

export class ProjectsModule {}
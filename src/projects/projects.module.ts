import { Global, Module } from '@nestjs/common';
import { Handlers } from './use-cases';
import { ProjectsController } from './controllers/projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModuleSettings } from './projects.module.settings';
import { ConfigService } from '@nestjs/config';
import * as moment from "moment";
import { ProjectsModuleSubscriberTask } from './solace-integration/projects.module.subscriber.task';
import { ProjectsModuleSchemas } from './persistence';
import { ProjectsSolaceController } from './controllers/projects-solace.controller';
import { ProjectsModuleSubscriber } from './solace-integration/projects.module.subscriber';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([...ProjectsModuleSchemas])
    ],
    providers: [ 
        ...Handlers,
        ProjectsModuleSubscriber,
        ProjectsModuleSubscriberTask,
        {
            provide: ProjectsModuleSettings,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const startReplayFromDateTime = configService.get("SOLACE_PROJECTS_QUEUE_REPLAY_FROM_DATETIME");
                
                const startReplayFromDateTimeFormat = configService.get("SOLACE_PROJECTS_QUEUE_REPLAY_FROM_DATETIME_FORMAT");

                return new ProjectsModuleSettings({
                    projectsSolaceQueueName: configService.get("SOLACE_PROJECTS_QUEUE"),
                    enabledSubscribe: configService.get("SOLACE_PROJECTS_QUEUE_SUBSCRIBE_ENABLED")?.toLowerCase() === 'true',
                    enabledReplay: configService.get("SOLACE_PROJECTS_QUEUE_REPLAY_ENABLED")?.toLowerCase() === 'true',
                    startReplayFromDatetime: !startReplayFromDateTime 
                                    ? null 
                                    : moment(startReplayFromDateTime, startReplayFromDateTimeFormat).toDate(),
                    startReplayFromLastMessageId: configService.get("SOLACE_PROJECTS_QUEUE_REPLAY_FROM_MESSAGEID")
                });
            }
        }
    ],
    controllers: [ProjectsController, ProjectsSolaceController]
})

export class ProjectsModule {}
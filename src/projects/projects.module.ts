import { Global, Module } from '@nestjs/common';
import { Handlers } from './use-cases';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModuleDataSource } from './persistence';
import { ProjectsModuleSettings } from './projects.module.settings';
import { ConfigService } from '@nestjs/config';
import * as moment from "moment";
import { ProjectsModuleSubscriberTask } from './solace-integration/projects.module.subscriber.task';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([...ProjectsModuleDataSource.Schemas])
    ],
    providers: [ 
        ...Handlers,
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
                                    : moment(startReplayFromDateTime, startReplayFromDateTimeFormat).toDate()
                });
            }
        }
    ],
    controllers: [ProjectsController]
})

export class ProjectsModule {}
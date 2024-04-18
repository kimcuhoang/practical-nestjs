import 'dotenv/config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@building-blocks/infra/database/database.module';
import { ConfigurationsModule } from '@building-blocks/infra/configurations/configurations.module';
import { ProjectsModule } from '@projects/projects.module';
import { ProjectsModuleDataSource } from '@projects/persistence';


@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigurationsModule,
    DatabaseModule.register({
      migrations: [
        ...ProjectsModuleDataSource.Migrations
      ]
    }),
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [ AppService ],
})
export class AppModule {
  
}

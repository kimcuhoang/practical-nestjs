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
import { RedisModule } from './building-blocks/infra/redis/redis.module';
import { RedisModule12 } from './building-blocks/infra/redis/redis12.module';


const infrastructureModules = [
  DatabaseModule.register({
    migrations: [
      ...ProjectsModuleDataSource.Migrations
    ]
  }),
  RedisModule.register(),
  RedisModule12.register(),
  ConfigurationsModule
];

const featureModules = [
  ProjectsModule
];

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ...infrastructureModules,
    ...featureModules
  ],
  controllers: [AppController],
  providers: [ AppService ],
})
export class AppModule {
  
}

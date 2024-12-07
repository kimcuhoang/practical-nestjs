import 'dotenv/config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationsModule } from '@building-blocks/infra/configurations/configurations.module';
import { ProjectsModule } from '@projects/projects.module';
import { RedisModule } from './building-blocks/infra/redis/redis.module';
import { RedisModule12 } from './building-blocks/infra/redis/redis12.module';
import { CachingModule } from './building-blocks/infra/caching/caching.module';
import { DatabaseModule, DatabaseModuleSettings } from './building-blocks/infra/database';
import { getDatabaseModuleSettings } from './typeorm.datasource';

const infrastructureModules = [
  DatabaseModule.register({
    getDatabaseModuleSettings(configService): DatabaseModuleSettings {
      return getDatabaseModuleSettings(configService);
    },
  }),
  CachingModule.register(),
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

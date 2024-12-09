import 'dotenv/config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from '@projects/projects.module';
import { DatabaseModule, DatabaseModuleSettings } from './building-blocks/infra/database';
import { getDatabaseModuleSettings } from './typeorm.datasource';
import { CachingModule } from '@building-blocks/infra/caching';
import { RedisIoRedisModule } from './building-blocks/infra/redis-ioredis';
import { RedisModule } from './building-blocks/infra/redis';

const infrastructureModules = [
  DatabaseModule.register({
    getDatabaseModuleSettings(configService): DatabaseModuleSettings {
      return getDatabaseModuleSettings(configService);
    },
  }),
  CachingModule.register(),
  RedisIoRedisModule.register(),
  RedisModule.register()
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

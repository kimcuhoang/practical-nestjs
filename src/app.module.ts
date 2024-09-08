
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from '@building-blocks/infra/database/database.module';
import { ConfigurationsModule } from '@building-blocks/infra/configurations/configurations.module';
import { ProjectsModule } from '@projects/projects.module';
import { ProjectsModuleDataSource } from '@projects/persistence';
import { RedisModule } from '@src/building-blocks/infra/redis/redis.module';
import { RedisModule12 } from '@src/building-blocks/infra/redis/redis12.module';
import { CachingModule } from '@src/building-blocks/infra/caching/caching.module';
import { DateTimeProvider } from "@src/building-blocks/providers";

const infrastructureModules = [
  DatabaseModule.register({
    migrations: [
      ...ProjectsModuleDataSource.Migrations
    ]
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
  controllers: [ AppController ],
  providers: [ DateTimeProvider ],
})
export class AppModule {
  
}

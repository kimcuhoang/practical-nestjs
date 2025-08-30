
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@building-blocks/infra/database';
import { CachingModule } from '@building-blocks/infra/caching';
import { RedisIoRedisModule } from '@building-blocks/infra/redis-ioredis';
import { RedisModule } from '@building-blocks/infra/redis';
import { getDatabaseModuleSettings } from './typeorm.datasource';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhraPlanningModule } from './w-hra-planning';

const infrastructureModules = [
  DatabaseModule.register(configService => {
    return getDatabaseModuleSettings(configService);
  }),
  CachingModule.register(),
  RedisIoRedisModule.register(),
  RedisModule.register()
];


@Module({
  imports: [
    ...infrastructureModules,
    CqrsModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    WhraPlanningModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

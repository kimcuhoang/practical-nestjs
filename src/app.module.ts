
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/infra-modules/database';
import { CachingModule } from '@src/infra-modules/caching';
import { RedisIoRedisModule } from '@src/infra-modules/redis-ioredis';
import { RedisModule } from '@src/infra-modules/redis';
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

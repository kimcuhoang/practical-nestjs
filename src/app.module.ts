
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/infra-modules/database';
import { getDatabaseModuleSettings } from './typeorm.datasource';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhraPlanningModule } from './w-hra-planning';
import { CachingModule } from './infra-modules/caching';
import { CacheSettings } from './infra-modules/caching/cache-settings';
import { plainToInstance } from 'class-transformer';

const infrastructureModules = [
  DatabaseModule.register(configService =>
    getDatabaseModuleSettings(configService)
  ),
  CachingModule.forRoot(configService => {
    const settings = plainToInstance(CacheSettings, {
      store: configService.get('CACHE_STORE', 'memory'),
      ttl: Number(configService.get('CACHE_TTL_IN_MINUTES', 3)),
      max: Number(configService.get('CACHE_MAX', 100)),
      redisUrl: configService.get('CACHE_REDIS_URL'),
    });
    return settings;
  }),
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

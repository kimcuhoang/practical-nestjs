
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@building-blocks/infra/database';
import { CachingModule } from '@building-blocks/infra/caching';
import { RedisIoRedisModule } from '@building-blocks/infra/redis-ioredis';
import { RedisModule } from '@building-blocks/infra/redis';
import { SolaceModule, SolaceModuleSettings } from '@building-blocks/infra/solace';
import { getDatabaseModuleSettings } from './typeorm.datasource';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OldAppModule } from './old-sources/old-app.module';
import { NewAppModule } from './new-sources';

const infrastructureModules = [
  DatabaseModule.register(configService => {
    return getDatabaseModuleSettings(configService);
  }),
  CachingModule.register(),
  RedisIoRedisModule.register(),
  RedisModule.register(),
  SolaceModule.register(configService => {
    return new SolaceModuleSettings({
      enabled: configService.get("SOLACE_ENABLED")?.toLowerCase() === "true",
      logLevel: configService.get("SOLACE_LOG_LEVEL"),
      clientName: configService.get("SOLACE_CLIENT_NAME"),
      solaceHost: configService.get("SOLACE_HOST"),
      solaceMessageVpn: configService.get("SOLACE_MESSAGE_VPN"),
      solaceUsername: configService.get("SOLACE_USERNAME"),
      solacePassword: configService.get("SOLACE_PASSWORD"),
      acknowledgeMessage: configService.get("SOLACE_ACKNOWLEDGE_MESSAGE")?.toLowerCase() === "true"
    });
  })
];


@Module({
  imports: [
    ...infrastructureModules,
    CqrsModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    OldAppModule,
    NewAppModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

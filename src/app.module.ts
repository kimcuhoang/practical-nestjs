import 'dotenv/config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule, DatabaseModuleSettings } from '@building-blocks/infra/database';
import { getDatabaseModuleSettings } from './typeorm.datasource';
import { CachingModule } from '@building-blocks/infra/caching';
import { RedisIoRedisModule } from '@building-blocks/infra/redis-ioredis';
import { RedisModule } from '@building-blocks/infra/redis';
import { ProjectsModule } from './projects';
import { SolaceModule, SolaceModuleSettings } from './building-blocks/infra/solace';

const infrastructureModules = [
  DatabaseModule.register({
    getDatabaseModuleSettings(configService): DatabaseModuleSettings {
      return getDatabaseModuleSettings(configService);
    }
  }),
  CachingModule.register(),
  RedisIoRedisModule.register(),
  RedisModule.register(),
  SolaceModule.register({
    getSolaceModuleSettings(configService: ConfigService): SolaceModuleSettings{
      return new SolaceModuleSettings({
        enabled: configService.get("SOLACE_ENABLED")?.toLowerCase() === "true",
        logLevel: configService.get("SOLACE_LOG_LEVEL"),
        clientName: configService.get("SOLACE_CLIENT_NAME"),
        solaceHost: configService.get("SOLACE_HOST"),
        solaceMessageVpn: configService.get("SOLACE_MESSAGE_VPN"),
        solaceUsername: configService.get("SOLACE_USERNAME"),
        solacePassword: configService.get("SOLACE_PASSWORD")
      });
    }
  })
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

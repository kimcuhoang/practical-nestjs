
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@building-blocks/infra/database';
import { CachingModule } from '@building-blocks/infra/caching';
import { RedisIoRedisModule } from '@building-blocks/infra/redis-ioredis';
import { RedisModule } from '@building-blocks/infra/redis';
import { SolaceModule, SolaceModuleSettings } from '@building-blocks/infra/solace';
import { ProjectsModule } from './projects';
import { NotificationsModule } from './notifications';
import { getDatabaseModuleSettings } from './typeorm.datasource';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocalizationsModule, LocalizationsModuleOptions } from './localizations';
import { BusinessPartnersModule, BusinessPartnersModuleOptions } from './business-partners';

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

const featureModules = [
  ProjectsModule,
  NotificationsModule,
  BusinessPartnersModule.register(configService => {
    return new BusinessPartnersModuleOptions({
      businessPartnerSolaceQueueName: configService.get<string>("BUSINESS_PARTNER_SOLACE_QUEUE"),
      enabledSubscribeTopics: configService.get("BUSINESS_PARTNER_SOLACE_ENABLED_SUBSCRIBE_TOPICS")?.toLowerCase() === 'true',
      topicCRT: configService.get("BUSINESS_PARTNER_SOLACE_QUEUE_TOPIC_CRT")
    });
  })
];

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    LocalizationsModule.register(configService => {
      return {
        fallbackLanguage: configService.get<string>("I18N_FALLBACK_LANGUAGE"),
        disableMiddleware: configService.get<string>("I18N_MIDDLEWARE_DISABLED")?.toLocaleLowerCase() === "true",
        logging: configService.get<string>("I18N_LOGGING_ENABLED")?.toLocaleLowerCase() === "true",
        fallbacks: {
          'vi': 'vi',
          'vi-*': 'vi',
          'en-*': 'en',
          // 'fr-*': 'fr',
          // 'pt-PT': 'pt-BR',
          // 'pt': 'pt-BR'
        }
      } as LocalizationsModuleOptions;
    }),
    ...infrastructureModules,
    ...featureModules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}

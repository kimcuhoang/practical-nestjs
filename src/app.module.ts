
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, DatabaseModuleOptions } from '@src/infra-modules/database';
import { getDatabaseModuleSettings } from './typeorm.datasource';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhraPlanningModule } from './w-hra-planning';
import { CachingModule } from './infra-modules/caching';
import { CacheSettings } from './infra-modules/caching/cache-settings';
import { plainToInstance } from 'class-transformer';
import { CalculatorModule } from './infra-modules/calculator';
import { ShipmentLanesModuleEntitySubscribers } from './w-hra-modules/shipment-lanes/persistence';

const infrastructureModules = [
  DatabaseModule.register(configService => {
    return plainToInstance(DatabaseModuleOptions, {
      ...getDatabaseModuleSettings(configService)
    });
  }),
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

    CalculatorModule.forRoot({
      initialValue: 100, // Configure the initial value here
    }),

  ],
  controllers: [AppController],
  providers: [
    AppService
    // ExplorerService,
    // {
    //   provide: CommandBus.name,
    //   useExisting: CommandBus
    //   // inject: [CommandBus, ExplorerService],
    //   // useFactory: (commandBus: CommandBus, explorerService: ExplorerService) => {
    //   //   const handlers = explorerService.explore();
    //   //   commandBus.register(handlers.commands);
    //   //   return commandBus;
    //   // }
    // },
    // {
    //   provide: QueryBus.name,
    //   useExisting: QueryBus,
    // },
    // {
    //   provide: EventBus.name,
    //   useExisting: EventBus,
    // }
  ]
})
export class AppModule { }

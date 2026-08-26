
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule, DatabaseModuleOptions } from '@src/infra-modules/database';
import { getDatabaseModuleSettings } from './typeorm.datasource';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhraPlanningModule } from './w-hra-planning';
import { plainToInstance } from 'class-transformer';
import { CalculatorModule } from './infra-modules/calculator';
import { HraCacheModule } from './infra-modules/cache/cache.module';

const infrastructureModules = [
  DatabaseModule.register(configService => {
    return plainToInstance(DatabaseModuleOptions, {
      ...getDatabaseModuleSettings(configService)
    });
  }),
  HraCacheModule.forRoot({
    cacheOptions: {
      useFactory: (configService) => {
        return {
          timeToLiveInMinutes: Number(configService.get('YAN_CACHE_TTL_IN_MINUTES', 30)),
          redisConnectionString: configService.get('YAN_REDIS_CONNECTION_STRING', 'redis://localhost:6379/0'),
          redisEnabled: configService.get('YAN_REDIS_ENABLED', true),
        };
      },
      inject: [ConfigService],
    }
  })
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
  providers: [ AppService ]
})
export class AppModule { }

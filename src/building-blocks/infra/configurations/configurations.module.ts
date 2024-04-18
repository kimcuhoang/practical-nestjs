import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass, OPTIONS_TYPE } from './configurtions.module-definition';
import { ConfigurationsService } from './configurations.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    ConfigurationsService,
    {
      provide: 'CONFIGURATIONS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get<string>('DATABASE_URL');
      }
    }
  ],
  exports: [ConfigurationsService]
})
export class ConfigurationsModule extends ConfigurableModuleClass { }

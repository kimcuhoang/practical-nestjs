
import { Module } from '@nestjs/common';
import { OldAppController } from './old-app.controller';
import { LocalizationsModule, LocalizationsModuleOptions } from './localizations';
import { NotificationsModule } from './notifications';
import { ProjectsModule } from './projects';


const featureModules = [
  ProjectsModule,
  NotificationsModule,
];

@Module({
  imports: [
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
    ...featureModules
  ],
  controllers: [OldAppController],
})
export class OldAppModule {
  // This module is used to demonstrate the old feature structure.
  // It can be removed or refactored as needed in the future.

}

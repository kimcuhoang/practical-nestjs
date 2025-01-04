import { DynamicModule, Global, Module } from "@nestjs/common";
import { LocalizationsModuleOptions } from "./localizations.module.options";
import { ConfigService } from "@nestjs/config";
import { HeaderResolver, I18nModule } from "nestjs-i18n";
import * as path from "path";

@Global()
@Module({})
export class LocalizationsModule {
    public static register(): DynamicModule {

        const getLocalizationsModuleOptions = (configService: ConfigService): LocalizationsModuleOptions => {
            return new LocalizationsModuleOptions({
                fallbackLanguage: configService.get<string>("FALLBACK_LANGUAGE")
            });
        };

        const i18nModule = I18nModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {

                const options = getLocalizationsModuleOptions(configService);

                return {
                    throwOnMissingKey: true,
                    fallbackLanguage: options.fallbackLanguage,
                    fallbacks: {
                        'vi': 'vi',
                        'vi-*': 'vi',
                        'en-*': 'en',
                        'fr-*': 'fr',
                        // 'pt-PT': 'pt-BR',
                        // 'pt': 'pt-BR'
                    },
                    logging: true,
                    validatorOptions: {
                        whitelist: true,
                        transform: true,
                        validationError: {
                            target: true,
                            value: true
                        }
                    },
                    resolvers: [
                        new HeaderResolver(['x-custom-lang', 'x-lang']),
                    ],
                    loaderOptions: {
                        paths: [path.join(__dirname, 'localizations/resources/')],
                        filePattern: '*.json',
                        watch: true,
                    }
                };
            }
        });

        return {
            module: LocalizationsModule,
            imports: [i18nModule],
            providers: [
                {
                    provide: LocalizationsModuleOptions,
                    inject: [ConfigService],
                    useFactory: getLocalizationsModuleOptions
                }
            ],
            exports: []
        };
    }
}
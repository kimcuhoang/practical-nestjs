import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HeaderResolver, I18nModule, I18nOptionsWithoutResolvers } from "nestjs-i18n";
import * as path from "path";
import { LocalizationsService } from "./localizations.service";

export type LocalizationsModuleOptions = Pick<I18nOptionsWithoutResolvers, "fallbackLanguage" 
                                                                            | "fallbacks" 
                                                                            | "disableMiddleware"
                                                                            | "logging">;

@Global()
@Module({})
export class LocalizationsModule {
    public static register(configure: (configService: ConfigService) => LocalizationsModuleOptions): DynamicModule {

        const i18nModule = I18nModule.forRootAsync({
            inject: [ ConfigService ],
            resolvers: [
                new HeaderResolver(['x-custom-lang', 'x-lang']),
            ],
            useFactory: (configService: ConfigService): I18nOptionsWithoutResolvers => {

                return {
                    ...configure(configService),
                    loaderOptions: {
                        path: path.join(__dirname, '/resources/'),
                        watch: true,
                    },
                } as I18nOptionsWithoutResolvers;
            }
        });

        return {
            module: LocalizationsModule,
            imports: [ i18nModule ],
            providers: [LocalizationsService],
            exports: [ LocalizationsService ]
        };
    }
}
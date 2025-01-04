import { Injectable } from "@nestjs/common";
import { I18nContext, I18nService } from "nestjs-i18n";
import { LocalizationsModuleOptions } from "./localizations.module.options";

@Injectable()
export class LocalizationsService {
    constructor(
        private readonly in18nService: I18nService,
        private readonly localizationsModuleOptions: LocalizationsModuleOptions
    ) {}

    public translate(key: string, options?: Record<string, any>): string {
        const language = I18nContext.current()?.lang ?? this.localizationsModuleOptions.fallbackLanguage;
        const translationParameters = {
            args: options || {}
        };
        return this.in18nService.translate(key, { lang: language, ...translationParameters });
    }
}
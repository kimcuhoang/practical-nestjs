import { Injectable } from "@nestjs/common";
import { I18nContext, I18nService } from "nestjs-i18n";

@Injectable()
export class LocalizationsService {
    constructor(
        private readonly in18nService: I18nService,
    ) {}

    public translate(key: string, options?: Record<string, any>): string {
        const language = I18nContext.current()?.lang!;
        
        const translationParameters = {
            args: options || {}
        };
        return this.in18nService.translate(key, { lang: language, ...translationParameters });
    }
}
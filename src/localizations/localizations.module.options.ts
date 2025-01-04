import { Injectable } from "@nestjs/common";


@Injectable()
export class LocalizationsModuleOptions {
    fallbackLanguage: string;

    constructor(options: Partial<LocalizationsModuleOptions>){
        Object.assign(this, options);
    }
}
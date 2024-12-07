import { Injectable } from "@nestjs/common";

@Injectable()
export class DatabaseModuleSettings {
    url: string;
    enableForLog: boolean;
    migrations: any[] = [];
    autoMigration: boolean;

    constructor(settings: Partial<DatabaseModuleSettings>){
        Object.assign(this, settings);
    }
}
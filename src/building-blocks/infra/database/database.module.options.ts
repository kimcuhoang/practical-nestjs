import { Injectable } from "@nestjs/common";

@Injectable()
export class DatabaseModuleOptions {
    url: string;
    enableForLog: boolean;
    migrations: any[] = [];
    autoMigration: boolean;

    constructor(settings: Partial<DatabaseModuleOptions>){
        Object.assign(this, settings);
    }
}
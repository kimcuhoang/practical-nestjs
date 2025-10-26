import { MixedList } from "typeorm";

export class DatabaseModuleOptions {
    url: string;
    migrations?: string[];
    enableForLog: boolean;
    autoMigration: boolean;

    subscribers?: MixedList<Function | string>;


    constructor(settings: Partial<DatabaseModuleOptions>){
        Object.assign(this, settings);
    }
};

export class DatabaseModuleOptions {
    url: string;
    migrations?: string[];
    enableForLog: boolean;
    autoMigration: boolean;

    constructor(settings: Partial<DatabaseModuleOptions>){
        Object.assign(this, settings);
    }
};
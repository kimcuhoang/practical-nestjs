import { ConfigurableModuleBuilder } from "@nestjs/common";

export class DatabaseConfiguration {
    databaseUrl: string;
}

const {
    ConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN,
    OPTIONS_TYPE,
    ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<DatabaseConfiguration>().build();

export {
    ConfigurableModuleClass as DatabaseConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN as DATABASE_OPTIONS_TOKEN
}

export type DatabaseModuleOptions = typeof OPTIONS_TYPE;
export type AsyncDatabaseModuleOptions = typeof ASYNC_OPTIONS_TYPE;
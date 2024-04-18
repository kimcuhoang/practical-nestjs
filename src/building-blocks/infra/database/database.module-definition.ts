import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface DatabaseConfiguration {
    migrations: any[];
}

const {
    ConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN,
    OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DatabaseConfiguration>().build();

export {
    ConfigurableModuleClass as DatabaseConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN as DATABASE_OPTIONS_TOKEN
}

export type DatabaseModuleOptions = typeof OPTIONS_TYPE;
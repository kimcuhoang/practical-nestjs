import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { 
    ConfigurableModuleClass, 
    OPTIONS_TYPE,
    ASYNC_OPTIONS_TYPE,
    MODULE_OPTIONS_TOKEN: ConfigurationsModuleOptions 
} =
new ConfigurableModuleBuilder().build();


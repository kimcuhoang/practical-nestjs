import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface CalculatorModuleOptions {
  initialValue?: number;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN  } 
= new ConfigurableModuleBuilder<CalculatorModuleOptions>()
        .setClassMethodName('forRoot')    
        .build();
import { Global, Module } from "@nestjs/common";
import { CalculatorService } from "./calculator.service";
import { ConfigurableModuleClass } from "./calculator-module-definition";

@Global()
@Module({
    providers: [
        {
            provide: CalculatorService.name,
            useClass: CalculatorService
        }
    ],
    exports: [
        CalculatorService.name,
    ],
})
export class CalculatorModule extends ConfigurableModuleClass { }
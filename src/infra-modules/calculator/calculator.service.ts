import { Inject, Injectable } from "@nestjs/common";
import { MODULE_OPTIONS_TOKEN, CalculatorModuleOptions } from "./calculator-module-definition";


@Injectable()
export class CalculatorService {

    private currentValue: number;

    constructor(
        @Inject(MODULE_OPTIONS_TOKEN)
        private options: CalculatorModuleOptions,
    ) {
        this.currentValue = options.initialValue || 0;
    }

    add(value: number): number {
        this.currentValue += value;
        return this.currentValue;
    }
}
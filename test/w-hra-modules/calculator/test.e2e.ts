import { CalculatorService } from "@src/infra-modules/calculator";


describe(`CalculatorModule (e2e)`, () => {
    test(`can add two numbers via token of '${CalculatorService.name}'`, () => {
        const calculatorService = global.nestApp.get(CalculatorService.name);
        const result = calculatorService.add(5);
        expect(result).toBeGreaterThan(5);
    });
});
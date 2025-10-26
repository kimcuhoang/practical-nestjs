import { CalculatorService } from "@src/infra-modules/calculator";
import { app } from "@test/test.setup";


describe(`CalculatorModule (e2e)`, () => {
    test(`can add two numbers via token of '${CalculatorService.name}'`, () => {
        const calculatorService = app.get(CalculatorService.name);
        const result = calculatorService.add(5);
        expect(result).toBeGreaterThan(5);
    });
});
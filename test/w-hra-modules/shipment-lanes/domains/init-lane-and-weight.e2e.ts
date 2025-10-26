import { faker } from "@faker-js/faker";
import { ShipmentLane, WeightRate, WeightRateValue } from "@src/w-hra-modules/shipment-lanes/domain";


describe(`Initialize ${ShipmentLane.name} and ${WeightRateValue.name} via ShipmentLanesAndWeightRatesInitializer`, () => {
    test(`should be success`, () => {
        const shipmentLane = new ShipmentLane();

        const tariff = shipmentLane.addTariff({
            bizPartnerCode: faker.string.alphanumeric(10).toUpperCase(),
            preferred: true
        });

        const tariffValidity = tariff.addValidity({
            validFrom: new Date("2024-01-01"),
            validTo: new Date("2024-12-31")
        });

        const weightRate = tariffValidity.addBaseRate<WeightRate>()
        const weightRateValue = weightRate.addBaseRateValue<WeightRateValue>();
        weightRateValue.value = 100;
        weightRateValue.perSegment = 1;
        weightRateValue.segmentUnit = "kg";

        expect(shipmentLane).toBeTruthy();
        expect(shipmentLane.tariffs).toHaveLength(1);
        expect(shipmentLane.tariffs.flatMap(t => t.validities)).toHaveLength(1);
        expect(shipmentLane.tariffs.flatMap(t => t.validities).flatMap(v => v.baseRates)).toHaveLength(1);
        expect(shipmentLane.tariffs.flatMap(t => t.validities).flatMap(v => v.baseRates).flatMap(br => br.values)).toHaveLength(1);

    });

});
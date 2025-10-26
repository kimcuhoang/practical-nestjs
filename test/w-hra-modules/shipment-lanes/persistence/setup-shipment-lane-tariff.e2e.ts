import { getEntityManagerToken, getRepositoryToken } from "@nestjs/typeorm";
import { ShipmentLane, Tariff, TariffValidity, WeightRate, WeightRateValue } from "@src/w-hra-modules/shipment-lanes/domain";
import { IShipmentLaneKeySettingsService, SHIPMENT_LANE_KEY_SETTINGS_SERVICE } from "@src/w-hra-modules/shipment-lanes/services/shipment-lane-key-settings";
import { app } from "@test/test.setup";
import { EntityManager, Repository } from "typeorm";


let shipmentLaneRepository: Repository<ShipmentLane>;
let entityManager: EntityManager;
let shipmentLaneKeySettingsService: IShipmentLaneKeySettingsService;

const spyInstances: jest.SpyInstance[] = [];
const codeTemplate = "#########";
const prefix = "SHIPMENT_LANE";

const shipmentLane = new ShipmentLane();

const tariff = shipmentLane.addTariff({
    bizPartnerCode: "BIZPARTNER1",
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


describe(`Setup from ${ShipmentLane.name} to ${WeightRateValue.name}`, () => {

    beforeAll(() => {
        shipmentLaneRepository = app.get(getRepositoryToken(ShipmentLane));
        entityManager = app.get(getEntityManagerToken());
        shipmentLaneKeySettingsService = app.get<IShipmentLaneKeySettingsService>(SHIPMENT_LANE_KEY_SETTINGS_SERVICE);
    });

    beforeEach(async () => {
        spyInstances.push(
            jest.spyOn(shipmentLaneKeySettingsService, "prefix", "get").mockReturnValue(prefix),
            jest.spyOn(shipmentLaneKeySettingsService, "template", "get").mockReturnValue(codeTemplate)
        );

        await shipmentLaneRepository.save(shipmentLane);
    });

    afterEach(async () => {
        await shipmentLaneRepository.delete({});
        spyInstances.forEach(spy => spy.mockRestore());
    });

    test(`should persist successfully`, async () => {
        const savedShipmentLane = await shipmentLaneRepository.findOne({
            where: {
                id: shipmentLane.id
            },
            relations: {
                tariffs: {
                    validities: {
                        baseRates: {
                            values: true
                        }
                    }
                }
            }
        });

        expect(savedShipmentLane).toBeTruthy();
        expect(savedShipmentLane.tariffs).toHaveLength(1);
        expect(savedShipmentLane.tariffs.flatMap(t => t.validities)).toHaveLength(1);
        expect(savedShipmentLane.tariffs.flatMap(t => t.validities).flatMap(v => v.baseRates)).toHaveLength(1);
        expect(savedShipmentLane.tariffs.flatMap(t => t.validities).flatMap(v => v.baseRates).flatMap(br => br.values)).toHaveLength(1);
    });
});
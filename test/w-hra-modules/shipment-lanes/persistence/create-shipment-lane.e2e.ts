import { getEntityManagerToken, getRepositoryToken } from "@nestjs/typeorm";
import { ShipmentLane } from "@src/w-hra-modules/shipment-lanes/domain";
import { IShipmentLaneKeySettingsService, SHIPMENT_LANE_KEY_SETTINGS_SERVICE } from "@src/w-hra-modules/shipment-lanes/services/shipment-lane-key-settings";
import { app } from "@test/test.setup";
import { EntityManager, Repository } from "typeorm";


describe(`Persist ${ShipmentLane.name}`, () => {
    let shipmentLaneRepository: Repository<ShipmentLane>;
    let entityManager: EntityManager;
    let shipmentLaneKeySettingsService: IShipmentLaneKeySettingsService;

    const codeTemplate = "#########";
    const prefix = "SHIPMENT_LANE";

    const spyInstances: jest.SpyInstance[] = [];

    beforeAll(() => {
        shipmentLaneRepository = app.get(getRepositoryToken(ShipmentLane));
        entityManager = app.get(getEntityManagerToken());
        shipmentLaneKeySettingsService = app.get<IShipmentLaneKeySettingsService>(SHIPMENT_LANE_KEY_SETTINGS_SERVICE);
    });

    beforeEach(() => {
        spyInstances.push(
            jest.spyOn(shipmentLaneKeySettingsService, "prefix", "get").mockReturnValue(prefix),
            jest.spyOn(shipmentLaneKeySettingsService, "template", "get").mockReturnValue(codeTemplate)
        );
    });

    afterEach(async() => {
        await shipmentLaneRepository.delete({});
        spyInstances.forEach(spy => spy.mockRestore());
    });

    test(`should be success within the code`, async() => {
        const shipmentLane = new ShipmentLane();
        const savedResult = await shipmentLaneRepository.save(shipmentLane);
    
        expect(savedResult).toBeTruthy();

        const savedShipmentLane = await shipmentLaneRepository.findOne({
            where: {
                id: savedResult.id
            }
        });

        expect(savedShipmentLane).toBeTruthy();
        expect(savedShipmentLane.code).toBeTruthy();
        expect(savedShipmentLane.code).toMatch(new RegExp(`^${prefix}\\d{${codeTemplate.length}}$`));
    });

});
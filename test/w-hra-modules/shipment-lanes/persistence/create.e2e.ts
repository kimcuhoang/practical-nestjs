import { getEntityManagerToken, getRepositoryToken } from "@nestjs/typeorm";
import { ShipmentLane } from "@src/w-hra-modules/shipment-lanes/domain";
import { ShipmentLaneSequence } from "@src/w-hra-modules/shipment-lanes/persistence";
import { app } from "@test/test.setup";
import { EntityManager, Repository } from "typeorm";


describe(`Persist ${ShipmentLane.name}`, () => {
    let shipmentLaneRepository: Repository<ShipmentLane>;
    let entityManager: EntityManager;

    const codeTemplate = "#########";

        
        //entity.code = `L${String(nextValue).padStart(codeTemplate.length, '0')}`

    beforeAll(() => {
        shipmentLaneRepository = app.get(getRepositoryToken(ShipmentLane));
        entityManager = app.get(getEntityManagerToken());
    });

    afterEach(async() => {
        await shipmentLaneRepository.delete({});
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

        const currentShipmentLaneSequence = await entityManager.query(`SELECT last_value FROM public.${ShipmentLaneSequence}`);
        const expectedCode = `L${String(currentShipmentLaneSequence[0].last_value).padStart(codeTemplate.length, '0')}`;
        expect(savedShipmentLane.code).toBe(expectedCode);

    });

});
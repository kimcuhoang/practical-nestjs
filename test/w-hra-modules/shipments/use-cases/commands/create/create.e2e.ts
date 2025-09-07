import { faker } from "@faker-js/faker";
import { CommandBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Shipment } from "@src/w-hra-modules/shipments/domain";
import { IShipmentAssignmentService, SHIPMENT_ASSIGNMENT_SERVICE } from "@src/w-hra-modules/shipments/services/sale-orders";
import { IShipmentKeyGenerator, SHIPMENT_KEY_GENERATOR_SYMBOL } from "@src/w-hra-modules/shipments/services/shipment-key-generator";
import { CreateShipmentPayload, CreateShipmentSaleOrderPayload, CreateShipmentSaleOrderItemPayload, CreateShipmentCommand } from "@src/w-hra-modules/shipments/use-cases/commands";
import { CreateShipmentHandler } from "@src/w-hra-modules/shipments/use-cases/commands/create/create-shipment.handler";
import { app, moment, TestHelpers } from "@test/test.setup";
import { Repository } from "typeorm";


describe(`Create ${Shipment.name} via ${CreateShipmentHandler.name}`, () => {
    let shipmentRepository: Repository<Shipment>;
    let commandBus: CommandBus;
    let shipmentAssignmentService: IShipmentAssignmentService;
    let spyInstanceOfEnsureSaleOrdersIsValid: jest.SpyInstance;
    let spyInstanceOfAssignShipmentToSaleOrders: jest.SpyInstance;
    let shipmentKeyGenerator: IShipmentKeyGenerator;
    let spyInstanceOfGenerateShipmentKey: jest.SpyInstance;


    const shipmentCode = "SHP00000000003000000001";


    beforeAll(() => {
        shipmentRepository = app.get(getRepositoryToken(Shipment));
        shipmentAssignmentService = app.get(SHIPMENT_ASSIGNMENT_SERVICE);
        shipmentKeyGenerator = app.get(SHIPMENT_KEY_GENERATOR_SYMBOL);
        commandBus = app.get(CommandBus.name);
    });

    beforeEach(() => {
        spyInstanceOfEnsureSaleOrdersIsValid = jest
            .spyOn(shipmentAssignmentService, 'ensureSaleOrdersIsValid')
            .mockResolvedValue([]);

        spyInstanceOfAssignShipmentToSaleOrders = jest
            .spyOn(shipmentAssignmentService, 'assignShipmentToSaleOrders')
            .mockResolvedValue(undefined);

        spyInstanceOfGenerateShipmentKey = jest
            .spyOn(shipmentKeyGenerator, 'generate')
            .mockResolvedValue(shipmentCode);
    });

    afterEach(async () => {
        await shipmentRepository.delete({});
        spyInstanceOfEnsureSaleOrdersIsValid.mockReset();
        spyInstanceOfAssignShipmentToSaleOrders.mockReset();
        spyInstanceOfGenerateShipmentKey.mockReset();
    });

    test(`should be success`, async () => {
        const payload = {
            bizUnitCode: TestHelpers.genCode(),
            regionCode: TestHelpers.genCode(2),
            startFromDateTime: new Date(),
            finishToDateTime: moment().add(1, "day").toDate(),
            sourceGeographyCode: TestHelpers.genCode(),
            destinationGeographyCode: TestHelpers.genCode(),
            saleOrders: faker.helpers.multiple(() => ({
                saleOrderCode: TestHelpers.genCode(),
                sourceGeographicalKey: TestHelpers.genCode(),
                destinationGeographicalKey: TestHelpers.genCode(),
                items: faker.helpers.multiple(() => ({
                    productCode: TestHelpers.genCode(),
                    quantity: faker.number.int({ min: 1, max: 100 }),
                }) satisfies CreateShipmentSaleOrderItemPayload, { count: 3 }),
            }) satisfies CreateShipmentSaleOrderPayload, { count: 2 }),
        } satisfies CreateShipmentPayload;

        const shipmentId = await commandBus.execute(new CreateShipmentCommand(payload));
        expect(shipmentId).toBeTruthy();

        const shipment = await shipmentRepository.findOne({
            where: { id: shipmentId },
            relations: {
                saleOrders: {
                    items: true,
                },
            }
        });
        expect(shipment).toBeTruthy();
        expect(shipment.shipmentCode).toBe(shipmentCode);
        expect(shipment.bizUnitCode).toBe(payload.bizUnitCode);
        expect(shipment.regionCode).toBe(payload.regionCode);
        expect(shipment.startFromDateTime).toEqual(payload.startFromDateTime);
        expect(shipment.finishToDateTime).toEqual(payload.finishToDateTime);
        expect(shipment.sourceGeographyCode).toBe(payload.sourceGeographyCode);
        expect(shipment.destinationGeographyCode).toBe(payload.destinationGeographyCode);
        expect(shipment.saleOrders).toHaveLength(payload.saleOrders.length);
    });
});
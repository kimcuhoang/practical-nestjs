import { faker } from "@faker-js/faker";
import { CommandBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Shipment } from "@src/w-hra-modules/shipments/domain";
import { CreateShipmentPayload, CreateShipmentSaleOrderPayload, CreateShipmentSaleOrderItemPayload, CreateShipmentCommand } from "@src/w-hra-modules/shipments/use-cases/commands";
import { CreateShipmentHandler } from "@src/w-hra-modules/shipments/use-cases/commands/shipments/create/create-shipment.handler";
import { SHIPMENT_ASSIGNMENT_SERVICE, IShipmentAssignmentService } from "@src/w-hra-modules/shipments/services/sale-orders/shipment-assignment-service.interface";
import { app, moment, TestHelpers } from "@test/test.setup";
import { Repository } from "typeorm";

describe(`Create ${Shipment.name} via ${CreateShipmentHandler.name}`, () => {
    let shipmentRepository: Repository<Shipment>;
    let commandBus: CommandBus;
    let mockShipmentAssignmentService: jest.Mocked<IShipmentAssignmentService>;

    beforeAll(() => {
        shipmentRepository = app.get(getRepositoryToken(Shipment));
        commandBus = app.get(CommandBus);
        mockShipmentAssignmentService = app.get(SHIPMENT_ASSIGNMENT_SERVICE);
    });

    beforeEach(() => {
        jest.spyOn(mockShipmentAssignmentService, 'ensureSaleOrdersIsValid')
            .mockResolvedValue([]);
        jest.spyOn(mockShipmentAssignmentService, 'assignShipmentToSaleOrders')
            .mockResolvedValue(undefined);
    });

    afterEach(async () => {
        await shipmentRepository.delete({});
        jest.clearAllMocks();
    });

    describe('Successful shipment creation', () => {
        test('should create shipment successfully with valid sale orders', async () => {
            const payload = createValidPayload();

            const shipmentId = await commandBus.execute(new CreateShipmentCommand(payload));

            expect(shipmentId).toBeTruthy();
            expect(mockShipmentAssignmentService.ensureSaleOrdersIsValid).toHaveBeenCalledTimes(1);
            expect(mockShipmentAssignmentService.ensureSaleOrdersIsValid).toHaveBeenCalledWith(
                payload.saleOrders.map(so => so.saleOrderCode)
            );
            expect(mockShipmentAssignmentService.assignShipmentToSaleOrders).toHaveBeenCalledTimes(1);
            expect(mockShipmentAssignmentService.assignShipmentToSaleOrders).toHaveBeenCalledWith(
                shipmentId,
                payload.saleOrders.map(so => so.saleOrderCode)
            );

            // Verify shipment was saved correctly
            const shipment = await shipmentRepository.findOne({
                where: { id: shipmentId },
                relations: {
                    saleOrders: {
                        items: true,
                    },
                }
            });

            expect(shipment).toBeTruthy();
            expect(shipment.shipmentCode).toBe(payload.shipmentCode);
            expect(shipment.bizUnitCode).toBe(payload.bizUnitCode);
            expect(shipment.regionCode).toBe(payload.regionCode);
            expect(shipment.startFromDateTime).toEqual(payload.startFromDateTime);
            expect(shipment.finishToDateTime).toEqual(payload.finishToDateTime);
            expect(shipment.sourceGeographyCode).toBe(payload.sourceGeographyCode);
            expect(shipment.destinationGeographyCode).toBe(payload.destinationGeographyCode);
            expect(shipment.saleOrders).toHaveLength(payload.saleOrders.length);
            
            // Verify sale order details
            payload.saleOrders.forEach((expectedSaleOrder, index) => {
                const actualSaleOrder = shipment.saleOrders[index];
                expect(actualSaleOrder.saleOrderCode).toBe(expectedSaleOrder.saleOrderCode);
                expect(actualSaleOrder.sourceGeographicalKey).toBe(expectedSaleOrder.sourceGeographicalKey);
                expect(actualSaleOrder.destinationGeographicalKey).toBe(expectedSaleOrder.destinationGeographicalKey);
                expect(actualSaleOrder.items).toHaveLength(expectedSaleOrder.items.length);
                
                expectedSaleOrder.items.forEach((expectedItem, itemIndex) => {
                    const actualItem = actualSaleOrder.items[itemIndex];
                    expect(actualItem.productCode).toBe(expectedItem.productCode);
                    expect(actualItem.quantity).toBe(expectedItem.quantity);
                });
            });
        });

        test('should create shipment with single sale order and single item', async () => {
            const payload = {
                shipmentCode: TestHelpers.genCode(),
                bizUnitCode: TestHelpers.genCode(),
                regionCode: TestHelpers.genCode(2),
                startFromDateTime: new Date(),
                finishToDateTime: moment().add(1, "day").toDate(),
                sourceGeographyCode: TestHelpers.genCode(),
                destinationGeographyCode: TestHelpers.genCode(),
                saleOrders: [{
                    saleOrderCode: TestHelpers.genCode(),
                    sourceGeographicalKey: TestHelpers.genCode(),
                    destinationGeographicalKey: TestHelpers.genCode(),
                    items: [{
                        productCode: TestHelpers.genCode(),
                        quantity: 1,
                    }],
                }],
            } satisfies CreateShipmentPayload;

            const shipmentId = await commandBus.execute(new CreateShipmentCommand(payload));

            expect(shipmentId).toBeTruthy();
            expect(mockShipmentAssignmentService.ensureSaleOrdersIsValid).toHaveBeenCalledWith([payload.saleOrders[0].saleOrderCode]);
            expect(mockShipmentAssignmentService.assignShipmentToSaleOrders).toHaveBeenCalledWith(
                shipmentId,
                [payload.saleOrders[0].saleOrderCode]
            );

            const shipment = await shipmentRepository.findOne({
                where: { id: shipmentId },
                relations: { saleOrders: { items: true } }
            });

            expect(shipment.saleOrders).toHaveLength(1);
            expect(shipment.saleOrders[0].items).toHaveLength(1);
        });
    });

    describe('Error scenarios', () => {
        test('should throw error when sale orders are invalid', async () => {
            const payload = createValidPayload();
            const invalidSaleOrders = [payload.saleOrders[0].saleOrderCode];
            
            mockShipmentAssignmentService.ensureSaleOrdersIsValid.mockResolvedValue(invalidSaleOrders);

            await expect(commandBus.execute(new CreateShipmentCommand(payload)))
                .rejects
                .toThrow(`Invalid sale orders: ${invalidSaleOrders.join(", ")}`);

            expect(mockShipmentAssignmentService.ensureSaleOrdersIsValid).toHaveBeenCalledTimes(1);
            expect(mockShipmentAssignmentService.assignShipmentToSaleOrders).not.toHaveBeenCalled();
            
            // Verify no shipment was created
            const shipmentCount = await shipmentRepository.count();
            expect(shipmentCount).toBe(0);
        });

        test('should throw error when multiple sale orders are invalid', async () => {
            const payload = createValidPayload();
            const invalidSaleOrders = payload.saleOrders.map(so => so.saleOrderCode);
            
            mockShipmentAssignmentService.ensureSaleOrdersIsValid.mockResolvedValue(invalidSaleOrders);

            await expect(commandBus.execute(new CreateShipmentCommand(payload)))
                .rejects
                .toThrow(`Invalid sale orders: ${invalidSaleOrders.join(", ")}`);

            expect(mockShipmentAssignmentService.ensureSaleOrdersIsValid).toHaveBeenCalledTimes(1);
            expect(mockShipmentAssignmentService.assignShipmentToSaleOrders).not.toHaveBeenCalled();
        });

        test('should handle validation service error', async () => {
            const payload = createValidPayload();
            const validationError = new Error('Validation service error');
            
            mockShipmentAssignmentService.ensureSaleOrdersIsValid.mockRejectedValue(validationError);

            await expect(commandBus.execute(new CreateShipmentCommand(payload)))
                .rejects
                .toThrow('Validation service error');

            expect(mockShipmentAssignmentService.ensureSaleOrdersIsValid).toHaveBeenCalledTimes(1);
            expect(mockShipmentAssignmentService.assignShipmentToSaleOrders).not.toHaveBeenCalled();
        });

        test('should handle assignment service error after successful creation', async () => {
            const payload = createValidPayload();
            const assignmentError = new Error('Assignment service error');
            
            mockShipmentAssignmentService.assignShipmentToSaleOrders.mockRejectedValue(assignmentError);

            await expect(commandBus.execute(new CreateShipmentCommand(payload)))
                .rejects
                .toThrow('Assignment service error');

            expect(mockShipmentAssignmentService.ensureSaleOrdersIsValid).toHaveBeenCalledTimes(1);
            expect(mockShipmentAssignmentService.assignShipmentToSaleOrders).toHaveBeenCalledTimes(1);
            
            // Due to @Transactional, the shipment should be rolled back
            const shipmentCount = await shipmentRepository.count();
            expect(shipmentCount).toBe(0);
        });
    });

    describe('Service interaction verification', () => {
        test('should call services with correct parameters for multiple sale orders', async () => {
            const payload = createValidPayload(3); // Create payload with 3 sale orders

            const shipmentId = await commandBus.execute(new CreateShipmentCommand(payload));

            const expectedSaleOrderCodes = payload.saleOrders.map(so => so.saleOrderCode);
            
            expect(mockShipmentAssignmentService.ensureSaleOrdersIsValid).toHaveBeenCalledWith(expectedSaleOrderCodes);
            expect(mockShipmentAssignmentService.assignShipmentToSaleOrders).toHaveBeenCalledWith(
                shipmentId,
                expectedSaleOrderCodes
            );
        });

        test('should handle empty invalid sale orders response', async () => {
            const payload = createValidPayload();
            
            // Explicitly mock empty array (which is valid)
            mockShipmentAssignmentService.ensureSaleOrdersIsValid.mockResolvedValue([]);

            const shipmentId = await commandBus.execute(new CreateShipmentCommand(payload));

            expect(shipmentId).toBeTruthy();
            expect(mockShipmentAssignmentService.ensureSaleOrdersIsValid).toHaveBeenCalledTimes(1);
            expect(mockShipmentAssignmentService.assignShipmentToSaleOrders).toHaveBeenCalledTimes(1);
        });
    });

    // Helper function to create valid test payload
    function createValidPayload(saleOrderCount = 2): CreateShipmentPayload {
        return {
            shipmentCode: TestHelpers.genCode(),
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
            }) satisfies CreateShipmentSaleOrderPayload, { count: saleOrderCount }),
        } satisfies CreateShipmentPayload;
    }
});
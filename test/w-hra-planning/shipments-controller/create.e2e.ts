import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { Shipment } from "@src/w-hra-modules/shipments/domain";
import { CreateShipmentPayload } from "@src/w-hra-modules/shipments/use-cases/commands";
import { ShipmentsController } from "@src/w-hra-planning/controllers/shipments.controller";
import { app, TestHelpers, moment, request } from "@test/test.setup";
import { In, Repository } from "typeorm";


describe(`Create ${Shipment.name} via ${ShipmentsController.name}`, () => {
    let shipmentRepository: Repository<Shipment>;
    let saleOrderRepository: Repository<SaleOrder>;

    const regionCode = "ES";
    const existingSaleOrders: SaleOrder[] = [];

    beforeAll(() => {
        shipmentRepository = app.get(getRepositoryToken(Shipment));
        saleOrderRepository = app.get(getRepositoryToken(SaleOrder));
    });

    beforeEach(async () => {
        existingSaleOrders.push(...faker.helpers.multiple(() => {
            const saleOrder = new SaleOrder();
            saleOrder.saleOrderCode = TestHelpers.genCode();
            saleOrder.sourceGeographicalKey = TestHelpers.genCode();
            saleOrder.destinationGeographicalKey = TestHelpers.genCode();
            saleOrder.regionCode = regionCode;
            
            saleOrder
            .addItem({
                productKey: TestHelpers.genCode(),
                quantity: faker.number.int({ min: 1, max: 100 }),
            })
            .addItem({
                productKey: TestHelpers.genCode(),
                quantity: faker.number.int({ min: 1, max: 100 }),
            });
            return saleOrder;
        }, { count: 2 }));

        await saleOrderRepository.save(existingSaleOrders);
    });

    afterEach(async () => {
        await shipmentRepository.delete({});
        await saleOrderRepository.delete({});
    });

    test(`should be success`, async () => {
        const payload = {
            shipmentCode: TestHelpers.genCode(),
            bizUnitCode: TestHelpers.genCode(),
            regionCode: regionCode,
            startFromDateTime: new Date(),
            finishToDateTime: moment().add(1, "day").toDate(),
            sourceGeographyCode: TestHelpers.genCode(),
            destinationGeographyCode: TestHelpers.genCode(),
            saleOrders: existingSaleOrders.map(saleOrder => ({
                saleOrderCode: saleOrder.saleOrderCode,
                sourceGeographicalKey: saleOrder.sourceGeographicalKey,
                destinationGeographicalKey: saleOrder.destinationGeographicalKey,
                items: saleOrder.items.map(item => ({
                    productCode: item.productKey,
                    quantity: item.quantity,
                })),
            }))
        } satisfies CreateShipmentPayload;

        const response = await request
                .post("/shipments")
                .send(payload)
                .expect(HttpStatus.CREATED);

        const shipmentId = response.text;
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
        expect(shipment.shipmentCode).toBe(payload.shipmentCode);
        expect(shipment.bizUnitCode).toBe(payload.bizUnitCode);
        expect(shipment.regionCode).toBe(payload.regionCode);
        expect(shipment.startFromDateTime).toEqual(payload.startFromDateTime);
        expect(shipment.finishToDateTime).toEqual(payload.finishToDateTime);
        expect(shipment.sourceGeographyCode).toBe(payload.sourceGeographyCode);
        expect(shipment.destinationGeographyCode).toBe(payload.destinationGeographyCode);
        expect(shipment.saleOrders).toHaveLength(payload.saleOrders.length);

        for (const saleOrder of shipment.saleOrders) {
            const payloadSaleOrder = payload.saleOrders.find(o => o.saleOrderCode === saleOrder.saleOrderCode);
            expect(saleOrder.saleOrderCode).toBe(payloadSaleOrder.saleOrderCode);
            expect(saleOrder.sourceGeographicalKey).toBe(payloadSaleOrder.sourceGeographicalKey);
            expect(saleOrder.destinationGeographicalKey).toBe(payloadSaleOrder.destinationGeographicalKey);
            expect(saleOrder.items).toHaveLength(payloadSaleOrder.items.length);

            for (const item of saleOrder.items) {
                const payloadItem = payloadSaleOrder.items.find(i => i.productCode === item.productCode);
                expect(item.productCode).toBe(payloadItem.productCode);
                expect(item.quantity).toEqual(payloadItem.quantity);
            }
        }

        const saleOrders = await saleOrderRepository.find({ 
            where: { id: In(existingSaleOrders.map(o => o.id)) }, 
            relations: {
                shipmentHistories: true,
            }
        });

        expect(saleOrders).toHaveLength(existingSaleOrders.length);
        for (const saleOrder of saleOrders) {
            expect(saleOrder.shipmentKey).toBe(shipment.shipmentCode);
            expect(saleOrder.shipmentHistories).toHaveLength(1);
            for (const history of saleOrder.shipmentHistories) {
                expect(history.shipmentKey).toBe(shipment.shipmentCode);
            }
        }
    });
});
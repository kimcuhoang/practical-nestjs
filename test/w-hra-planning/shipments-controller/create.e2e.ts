import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizUnit, CommonSettings } from "@src/w-hra-modules/biz-units/domain";
import { ShipmentKeySettings } from "@src/w-hra-modules/biz-units/domain/models/value-objects/shipment-key-settings";
import { ShipmentLaneKeySettings } from "@src/w-hra-modules/biz-units/domain/models/value-objects/shipment-lane-key-settings";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { Shipment } from "@src/w-hra-modules/shipments/domain";
import { ShipmentsSequences } from "@src/w-hra-modules/shipments/persistence/sequences";
import { IShipmentKeyGenerator, SHIPMENT_KEY_GENERATOR_SYMBOL } from "@src/w-hra-modules/shipments/services/shipment-key-generator";
import { CreateShipmentPayload } from "@src/w-hra-modules/shipments/use-cases/commands";
import { ShipmentsController } from "@src/w-hra-planning/controllers/shipments.controller";
import { app, TestHelpers, moment, request } from "@test/test.setup";
import { plainToClassFromExist, plainToInstance } from "class-transformer";
import { In, Repository } from "typeorm";


describe(`Create ${Shipment.name} via ${ShipmentsController.name}`, () => {
    let bizUnitRepository: Repository<BizUnit>;
    let shipmentRepository: Repository<Shipment>;
    let saleOrderRepository: Repository<SaleOrder>;
    let shipmentKeyGeneratorService: IShipmentKeyGenerator;


    const regionCode = "ES";
    const existingSaleOrders: SaleOrder[] = [];
    const bizUnit = new BizUnit();

    beforeAll(() => {
        bizUnitRepository = app.get(getRepositoryToken(BizUnit));
        shipmentRepository = app.get(getRepositoryToken(Shipment));
        saleOrderRepository = app.get(getRepositoryToken(SaleOrder));
        shipmentKeyGeneratorService = app.get<IShipmentKeyGenerator>(SHIPMENT_KEY_GENERATOR_SYMBOL);
    });

    beforeEach(async () => {

        plainToClassFromExist(bizUnit, {
            bizUnitCode: "TEST",
            commonSettings: plainToInstance(CommonSettings, {
                countryCode: faker.location.countryCode(),
                timeZone: "GMT+7"
            } satisfies CommonSettings),
            shipmentKeySettings: plainToInstance(ShipmentKeySettings, {
                prefix: "SHP000000000030",
                sequenceStart: "00000000",
                sequenceEnd: "99999999"
            } satisfies ShipmentKeySettings),
            shipmentLaneKeySettings: plainToInstance(ShipmentLaneKeySettings, {
                prefix: "SHPLANE000000000050",
                template: "#########"
            } satisfies ShipmentLaneKeySettings),
        });
        bizUnit.addBizUnitRegion(regionCode);

        existingSaleOrders.push(...faker.helpers.multiple(() => {
            return plainToInstance(SaleOrder, {
                regionCode: regionCode,
                saleOrderCode: TestHelpers.genCode(),
                sourceGeographicalKey: TestHelpers.genCode(),
                destinationGeographicalKey: TestHelpers.genCode(),
            })
                .addItem({
                    productKey: TestHelpers.genCode(),
                    quantity: faker.number.int({ min: 1, max: 100 }),
                })
                .addItem({
                    productKey: TestHelpers.genCode(),
                    quantity: faker.number.int({ min: 1, max: 100 }),
                });
        }, { count: 2 }));

        await bizUnitRepository.save(bizUnit);
        await saleOrderRepository.save(existingSaleOrders);
        await shipmentKeyGeneratorService.loadSettings();
    });

    afterEach(async () => {
        await bizUnitRepository.delete({});
        await shipmentRepository.delete({});
        await saleOrderRepository.delete({});
    });

    test(`should be success`, async () => {
        const payload = {
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

        await request
            .post("/shipments")
            .send(payload)
            .expect(HttpStatus.CREATED)
            .expect(async (res: any) => {
                const shipmentId = res.text;
                expect(shipmentId).toBeTruthy();

                const currentShipmentSequence = await shipmentRepository.query(`SELECT last_value as currval FROM public.${ShipmentsSequences.shipmentSequence};`);
                const currentShipmentSequenceValue = Number(currentShipmentSequence[0]?.currval);
                expect(currentShipmentSequenceValue).toBeGreaterThan(0);

                const expectedShipmentCode = `${bizUnit.shipmentKeySettings.prefix}${String(currentShipmentSequenceValue).padStart(bizUnit.shipmentKeySettings.sequenceStart.length, '0')}`;

                const shipment = await shipmentRepository.findOne({
                    where: { id: shipmentId },
                    relations: {
                        saleOrders: {
                            items: true,
                        },
                    }
                });

                expect(shipment).toBeTruthy();
                expect(shipment.shipmentCode).toBe(expectedShipmentCode);
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
});
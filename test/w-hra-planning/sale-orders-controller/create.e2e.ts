import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { CreateSaleOrderItemPayload, CreateSaleOrderPayload } from "@src/w-hra-modules/sale-orders/use-cases/commands";
import { BizUnit } from "@src/w-hra-modules/shipments/domain";
import { SaleOrdersController } from "@src/w-hra-planning/controllers/sale-orders.controller";
import { app, request, TestHelpers } from "@test/test.setup";
import { Repository } from "typeorm";


describe(`Create ${SaleOrder.name} via ${SaleOrdersController.name}`, () => {
    let saleOrderRepository: Repository<SaleOrder>;
    let bizUnitRepository: Repository<BizUnit>;
    const regionCode = "ES";
    let bizUnit: BizUnit;

    beforeAll(() => {
        saleOrderRepository = app.get(getRepositoryToken(SaleOrder));
        bizUnitRepository = app.get(getRepositoryToken(BizUnit));
    });

    beforeEach(async () => {
        bizUnit = new BizUnit();
        bizUnit.bizUnitCode = TestHelpers.genCode();
        bizUnit.settings = {
            countryCode: "ES",
            timeZone: "GMT+1",
        };
        bizUnit.addBizUnitRegion(regionCode);

        await bizUnitRepository.save(bizUnit);
        expect(bizUnit).toBeTruthy();
    });

    afterEach(async () => {
        await saleOrderRepository.delete({});
        await bizUnitRepository.delete({});
    });

    test(`should be success`, async () => {
        const payload = {
            saleOrderCode: TestHelpers.genCode(),
            sourceGeographicalKey: TestHelpers.genCode(),
            destinationGeographicalKey: TestHelpers.genCode(),
            regionCode: regionCode,
            items: faker.helpers.multiple(() => ({
                productKey: TestHelpers.genCode(),
                quantity: faker.number.int({ min: 10, max: 100 })
            } satisfies CreateSaleOrderItemPayload), { count: 3 })
        } satisfies CreateSaleOrderPayload;

        console.log(JSON.stringify(payload));

        const response = await request
            .post(`/sale-orders`)
            .send(payload)
            .expect(HttpStatus.CREATED);

        const saleOrderId = response.text;
        expect(saleOrderId).toBeTruthy();

        const saleOrder = await saleOrderRepository.findOne({ 
            where: { id: saleOrderId },
            relations: {
                items: true
            }
        });
        expect(saleOrder).toBeTruthy();
        expect(saleOrder.saleOrderCode).toBe(payload.saleOrderCode);
        expect(saleOrder.sourceGeographicalKey).toBe(payload.sourceGeographicalKey);
        expect(saleOrder.destinationGeographicalKey).toBe(payload.destinationGeographicalKey);
        expect(saleOrder.regionCode).toBe(payload.regionCode);
        expect(saleOrder.items).toHaveLength(payload.items.length);

        for(const item of saleOrder.items) {
            const payloadItem = payload.items.find(i => i.productKey === item.productKey);
            expect(payloadItem).toBeTruthy();
            expect(item.quantity).toBe(payloadItem.quantity);
        }
    });
});
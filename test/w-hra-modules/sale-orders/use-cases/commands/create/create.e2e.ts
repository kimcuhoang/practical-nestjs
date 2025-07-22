import { faker } from "@faker-js/faker";
import { CommandBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { ISaleOrderCreationValidationService, SaleOrderCreationValidationServiceSymbol } from "@src/w-hra-modules/sale-orders/services";
import { CreateSaleOrderCommand, CreateSaleOrderItemPayload, CreateSaleOrderPayload } from "@src/w-hra-modules/sale-orders/use-cases/commands";
import { CreateSaleOrderHandler } from "@src/w-hra-modules/sale-orders/use-cases/commands/create/create-sale-order.handler";
import { BizUnit } from "@src/w-hra-modules/shipments/domain";
import { app, TestHelpers } from "@test/test.setup";
import { Repository } from "typeorm";

describe(`Create ${SaleOrder.name} via ${CreateSaleOrderHandler.name}`, () => {
    let saleOrderRepository: Repository<SaleOrder>;
    let bizUnitRepository: Repository<BizUnit>;
    let commandBus: CommandBus;
    let saleOrderCreationValidationService: ISaleOrderCreationValidationService;
    // jest.Mocked<ISaleOrderCreationValidationService>;


    beforeAll(() => {
        saleOrderRepository = app.get(getRepositoryToken(SaleOrder));
        bizUnitRepository = app.get(getRepositoryToken(BizUnit));
        commandBus = app.get(CommandBus);
        saleOrderCreationValidationService = app.get(SaleOrderCreationValidationServiceSymbol);
    });

    beforeEach(() => {
        jest.spyOn(saleOrderCreationValidationService, "canCreateSaleOrder")
            .mockResolvedValue(true);
    });

    afterEach(async() => {
        await saleOrderRepository.delete({});
        jest.clearAllMocks();
    });

    test(`should be success`, async() => {
        const payload = {
            saleOrderCode: TestHelpers.genCode(),
            sourceGeographicalKey: TestHelpers.genCode(),
            destinationGeographicalKey: TestHelpers.genCode(),
            regionCode: TestHelpers.genCode(2),
            items: faker.helpers.multiple(() => ({
                productKey: TestHelpers.genCode(),
                quantity: faker.number.int({ min: 10, max: 100 })
            } satisfies CreateSaleOrderItemPayload), { count: 3 } )
        } satisfies CreateSaleOrderPayload;

        const saleOrderId = await commandBus.execute(new CreateSaleOrderCommand(payload));

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
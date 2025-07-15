import { faker } from "@faker-js/faker";
import { CommandBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { CreateSaleOrderCommand, CreateSaleOrderItemPayload, CreateSaleOrderPayload } from "@src/w-hra-modules/sale-orders/use-cases/commands";
import { CreateSaleOrderHandler } from "@src/w-hra-modules/sale-orders/use-cases/commands/create/create-sale-order.handler";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";

const genCode = () => faker.string.alphanumeric(10).toUpperCase();


describe(`Create ${SaleOrder.name} via ${CreateSaleOrderHandler.name}`, () => {
    let saleOrderRepository: Repository<SaleOrder>;
    let commandBus: CommandBus;

    beforeAll(() => {
        saleOrderRepository = app.get(getRepositoryToken(SaleOrder));
        commandBus = app.get(CommandBus);
    });

    afterEach(async() => {
        await saleOrderRepository.delete({});
    });

    test(`should be success`, async() => {
        const payload = {
            saleOrderCode: genCode(),
            sourceGeographicalKey: genCode(),
            destinationGeographicalKey: genCode(),
            regionCode: "ES01",
            items: faker.helpers.multiple(() => ({
                productKey: genCode(),
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
        expect(saleOrder.items).toHaveLength(payload.items.length);
    });
});
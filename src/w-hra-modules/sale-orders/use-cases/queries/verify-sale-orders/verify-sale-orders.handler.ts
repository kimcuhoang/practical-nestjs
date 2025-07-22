import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { VerifySaleOrdersRequest } from "./verify-sale-orders.request";
import { InjectRepository } from "@nestjs/typeorm";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { In, Repository } from "typeorm";

@QueryHandler(VerifySaleOrdersRequest)
export class VerifySaleOrderHandler implements IQueryHandler<VerifySaleOrdersRequest, string[]> {

    constructor(
        @InjectRepository(SaleOrder)
        private readonly saleOrderRepository: Repository<SaleOrder>,
    ) { }

    public async execute(request: VerifySaleOrdersRequest): Promise<string[]> {
        const saleOrderKeys = request.saleOrderKeys;

        if (!saleOrderKeys || saleOrderKeys.length === 0) {
            throw new Error("No sale order keys provided for verification.");
        }

        const saleOrders = await this.saleOrderRepository.find({
            where: {
                saleOrderCode: In(saleOrderKeys)
            },
            select: [ "saleOrderCode" ]
        });

        const missingKeys = saleOrderKeys.filter(key => !saleOrders.some(so => so.saleOrderCode === key));

        return missingKeys;
    }
}
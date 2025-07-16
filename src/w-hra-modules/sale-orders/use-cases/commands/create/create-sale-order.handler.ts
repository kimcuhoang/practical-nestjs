import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateSaleOrderCommand } from "./create-sale-order.command";
import { Repository } from "typeorm";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject } from "@nestjs/common";
import { ISaleOrderCreationValidationService, SaleOrderCreationValidationServiceSymbol } from "@src/w-hra-modules/sale-orders/services";

@CommandHandler(CreateSaleOrderCommand)
export class CreateSaleOrderHandler implements ICommandHandler<CreateSaleOrderCommand, string> {
    
    constructor(
        @InjectRepository(SaleOrder)
        private readonly saleOrderRepository: Repository<SaleOrder>,
        @Inject(SaleOrderCreationValidationServiceSymbol)
        private readonly saleOrderCreationValidationService: ISaleOrderCreationValidationService
    ){}
    
    public async execute(command: CreateSaleOrderCommand): Promise<string> {

        const payload = command.payload;

        const saleOrder = new SaleOrder();
        saleOrder.saleOrderCode = payload.saleOrderCode;
        saleOrder.sourceGeographicalKey = payload.sourceGeographicalKey;
        saleOrder.destinationGeographicalKey = payload.destinationGeographicalKey;
        saleOrder.regionCode = payload.regionCode;
        
        for(const item of payload.items) {
            saleOrder.addItem({
                productKey: item.productKey,
                quantity: item.quantity
            });
        }

        if (!await this.saleOrderCreationValidationService.canCreateSaleOrder(saleOrder)) {
            throw new Error("Sale order validation failed");
        }

        const savedResult = await this.saleOrderRepository.save(saleOrder);
        return savedResult.id;
    }
}
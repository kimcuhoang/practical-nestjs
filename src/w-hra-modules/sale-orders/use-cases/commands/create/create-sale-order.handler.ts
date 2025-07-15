import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateSaleOrderCommand } from "./create-sale-order.command";
import { Repository } from "typeorm";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { InjectRepository } from "@nestjs/typeorm";

@CommandHandler(CreateSaleOrderCommand)
export class CreateSaleOrderHandler implements ICommandHandler<CreateSaleOrderCommand, string> {
    
    constructor(
        @InjectRepository(SaleOrder)
        private readonly saleOrderRepository: Repository<SaleOrder>
    ){}
    
    public async execute(command: CreateSaleOrderCommand): Promise<string> {

        const payload = command.payload;

        const saleOrder = new SaleOrder();
        saleOrder.saleOrderCode = payload.saleOrderCode;
        saleOrder.sourceGeographicalKey = payload.sourceGeographicalKey;
        saleOrder.destinationGeographicalKey = payload.sourceGeographicalKey;
        saleOrder.regionCode = payload.regionCode;
        
        for(const item of payload.items) {
            saleOrder.addItem({
                productKey: item.productKey,
                quantity: item.quantity
            });
        }

        const savedResult = await this.saleOrderRepository.save(saleOrder);
        return savedResult.id;
    }
}
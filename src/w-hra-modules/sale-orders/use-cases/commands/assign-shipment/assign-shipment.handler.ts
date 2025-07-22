import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AssignShipmentCommand } from "./assign-shipment.command";
import { InjectRepository } from "@nestjs/typeorm";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { In, Repository } from "typeorm";
import { Propagation, runInTransaction, Transactional } from "typeorm-transactional";
import { plainToInstance } from "class-transformer";

@CommandHandler(AssignShipmentCommand)
export class AssignShipmentHandler implements ICommandHandler<AssignShipmentCommand, void> {

    constructor(
        @InjectRepository(SaleOrder)
        private readonly saleOrderRepository: Repository<SaleOrder>
    ) { }

    @Transactional()
    public async execute(command: AssignShipmentCommand): Promise<void> {
        await runInTransaction(async () => {

            const saleOrdersRaw = await this.saleOrderRepository.find({
                where: { saleOrderCode: In(command.saleOrderCodes) },
                relations: {
                    shipmentHistories: true
                }
            });

            if (!saleOrdersRaw?.length) {
                throw new Error(`Sale orders with codes ${command.saleOrderCodes.join(", ")} not found`);
            }

            const saleOrders = saleOrdersRaw
                    .map(so => plainToInstance(SaleOrder, so));

            for (const saleOrder of saleOrdersRaw) {
                saleOrder.assignToShipment(command.shipmentCode);
            }

            await this.saleOrderRepository.save(saleOrdersRaw);
            
        }, { propagation: Propagation.SUPPORTS }); // only one transaction
    }
}
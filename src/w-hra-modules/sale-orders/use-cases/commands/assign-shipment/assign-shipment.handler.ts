import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AssignShipmentCommand } from "./assign-shipment.command";
import { InjectRepository } from "@nestjs/typeorm";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { In, Repository } from "typeorm";
import { Propagation, runInTransaction } from "typeorm-transactional";

@CommandHandler(AssignShipmentCommand)
export class AssignShipmentHandler implements ICommandHandler<AssignShipmentCommand, void> {

    constructor(
        @InjectRepository(SaleOrder)
        private readonly saleOrderRepository: Repository<SaleOrder>
    ) { }

    public async execute(command: AssignShipmentCommand): Promise<void> {
        await runInTransaction(async () => {

            const saleOrders = await this.saleOrderRepository.find({
                where: { saleOrderCode: In(command.saleOrderCodes) },
                relations: {
                    shipmentHistories: true
                }
            });

            if (!saleOrders?.length) {
                throw new Error(`Sale orders with codes ${command.saleOrderCodes.join(", ")} not found`);
            }

            for (const saleOrder of saleOrders) {
                saleOrder.assignToShipment(command.shipmentCode);
            }

            await this.saleOrderRepository.save(saleOrders);
            
        }, { propagation: Propagation.SUPPORTS }); // only one transaction
    }
}
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AssignShipmentCommand } from "./assign-shipment.command";
import { InjectRepository } from "@nestjs/typeorm";
import { SaleOrder, SaleOrderShipmentHistory } from "@src/w-hra-modules/sale-orders/domain";
import { In, Repository } from "typeorm";
import { Propagation, runInTransaction, Transactional } from "typeorm-transactional";

@CommandHandler(AssignShipmentCommand)
export class AssignShipmentHandler implements ICommandHandler<AssignShipmentCommand, void> {

    constructor(
        @InjectRepository(SaleOrder)
        private readonly saleOrderRepository: Repository<SaleOrder>
    ) { }

    @Transactional()
    public async execute(command: AssignShipmentCommand): Promise<void> {
        await runInTransaction(async () => {

            const saleOrders = await this.saleOrderRepository.find({
                where: { saleOrderCode: In(command.saleOrderCodes) },
                relations: {
                    shipmentHistories: true
                }
            });

            if (!saleOrders || saleOrders.length === 0) {
                throw new Error(`Sale orders with codes ${command.saleOrderCodes.join(", ")} not found`);
            }

            for (const saleOrder of saleOrders) {
                saleOrder.shipmentKey = command.shipmentCode;
                const shipmentHistory = new SaleOrderShipmentHistory(saleOrder);
                shipmentHistory.shipmentKey = command.shipmentCode;
                saleOrder.shipmentHistories.push(shipmentHistory);
            }

            await this.saleOrderRepository.save(saleOrders);
            
        }, { propagation: Propagation.SUPPORTS }); // only one transaction
    }
}
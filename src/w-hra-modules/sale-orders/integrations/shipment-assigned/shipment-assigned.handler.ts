import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ShipmentAssignedEvent } from "./shipment-assigned.event";
import { SaleOrder } from "../../domain";
import { Repository } from "typeorm";
import { runInTransaction } from "typeorm-transactional";
import { InjectRepository } from "@nestjs/typeorm";

@EventsHandler(ShipmentAssignedEvent)
export class ShipmentAssignedHandler implements IEventHandler<ShipmentAssignedEvent> {

    constructor(
        @InjectRepository(SaleOrder)
        private readonly saleOrderRepository: Repository<SaleOrder>
    ){}

    public async handle(event: ShipmentAssignedEvent): Promise<void> {
        
        await runInTransaction(async () => {

            const saleOrder = await this.saleOrderRepository.findOne({
                where: { saleOrderCode: event.saleOrderCode },
                relations: {
                    shipmentHistories: true
                }
            });
            if (!saleOrder) {
                throw new Error(`Sale order with code ${event.saleOrderCode} not found`);   
            }

            saleOrder.assignToShipment(event.shipmentCode);
            await this.saleOrderRepository.save(saleOrder);
        });
    }
}
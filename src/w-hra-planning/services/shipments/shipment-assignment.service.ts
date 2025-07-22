import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AssignShipmentCommand } from "@src/w-hra-modules/sale-orders/use-cases/commands";
import { VerifySaleOrdersRequest } from "@src/w-hra-modules/sale-orders/use-cases/queries";
import { IShipmentAssignmentService } from "@src/w-hra-modules/shipments/services/sale-orders/shipment-assignment-service.interface";

@Injectable()
export class shipmentAssignmentService implements IShipmentAssignmentService {
    
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
    ) {}

    public async ensureSaleOrdersIsValid(saleOrderKeys: string[]): Promise<string[]> {
        return await this.queryBus.execute(new VerifySaleOrdersRequest(saleOrderKeys));
    }

    public async assignShipmentToSaleOrders(shipmentId: string, saleOrderKeys: string[]): Promise<void> {
        return await this.commandBus.execute(new AssignShipmentCommand(shipmentId, saleOrderKeys));
    }
}
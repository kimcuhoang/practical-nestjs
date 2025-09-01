import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { Type } from "class-transformer";
import { ShipmentSaleOrder } from "./shipment-sale-order";


export class ShipmentSaleOrderItem extends EntityBase {
    readonly saleOrderId: string;
    @Type(() => ShipmentSaleOrder)
    readonly saleOrder: ShipmentSaleOrder;

    productCode: string;
    quantity: number;

    constructor(shipmentSaleOrder?: ShipmentSaleOrder) {
        super();

        if (shipmentSaleOrder) {
            this.saleOrder = shipmentSaleOrder;
            this.saleOrderId = shipmentSaleOrder.id;
        }
    }
}
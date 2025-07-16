import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { ShipmentSaleOrder } from "./shipment-sale-order";


export class ShipmentSaleOrderItem extends EntityBase {
    readonly saleOrderId: string;
    @Type(() => ShipmentSaleOrder)
    readonly saleOrder: ShipmentSaleOrder;

    productCode: string;
    quantity: number;

    constructor(shipmentSaleOrder: ShipmentSaleOrder) {
        super();
        this.saleOrder = shipmentSaleOrder;
        this.saleOrderId = shipmentSaleOrder.id;
    }
}
import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { SaleOrder } from "./sale-order";
import { Type } from "class-transformer";


export class SaleOrderShipmentHistory extends EntityBase {
    readonly saleOrderId: string;
    @Type(() => SaleOrder)
    readonly saleOrder: SaleOrder;

    shipmentKey!: string;

    constructor(saleOrder?: SaleOrder) {
        super();
        if (!!saleOrder) {
            this.saleOrder = saleOrder;
            this.saleOrderId = saleOrder.id;
        }
    }
}
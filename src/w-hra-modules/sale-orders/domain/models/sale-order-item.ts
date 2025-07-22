import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { SaleOrder } from "./sale-order";


export class SaleOrderItem extends EntityBase {
    readonly saleOrderId: string;
    @Type(() => SaleOrder)
    readonly saleOrder: SaleOrder;

    productKey: string;
    quantity: number;

    constructor(saleOrder?: SaleOrder) {
        super();
        if (!!saleOrder) {
            this.saleOrder = saleOrder;
            this.saleOrderId = saleOrder.id;
        }
    }
}
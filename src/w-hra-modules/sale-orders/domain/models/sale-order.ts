import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { SaleOrderItem } from "./sale-order-item";


export class SaleOrder extends EntityBase {
    saleOrderCode: string;
    
    sourceGeographicalKey: string;
    destinationGeographicalKey: string;

    regionCode: string;

    @Type(() => SaleOrderItem)
    items: SaleOrderItem[];

    constructor() {
        super();
        this.items = [];
    }

    public addItem(partial: Partial<SaleOrderItem>): SaleOrder {
        const saleOrderItem = new SaleOrderItem(this);
        Object.assign(saleOrderItem, partial);
        this.items.push(saleOrderItem);
        return this;
    }
}
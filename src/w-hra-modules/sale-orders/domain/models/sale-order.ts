import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { SaleOrderItem } from "./sale-order-item";
import { SaleOrderShipmentHistory } from "./sale-order-shipment-history";


export class SaleOrder extends EntityBase {
    saleOrderCode: string;
    
    sourceGeographicalKey: string;
    destinationGeographicalKey: string;

    regionCode: string;

    shipmentKey?: string | null = null;

    @Type(() => SaleOrderItem)
    items: SaleOrderItem[];

    @Type(() => SaleOrderShipmentHistory)
    shipmentHistories: SaleOrderShipmentHistory[];

    constructor() {
        super();
        this.items = [];
        this.shipmentHistories = [];
    }

    public addItem(partial: Partial<SaleOrderItem>): SaleOrder {
        const saleOrderItem = new SaleOrderItem(this);
        Object.assign(saleOrderItem, partial);
        this.items.push(saleOrderItem);
        return this;
    }

    public assignToShipment(shipmentKey: string): void {
        this.shipmentKey = shipmentKey;
        const shipmentHistory = new SaleOrderShipmentHistory(this);
        shipmentHistory.shipmentKey = shipmentKey;
        this.shipmentHistories.push(shipmentHistory);
    }
}
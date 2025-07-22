import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { Shipment } from "./shipment";
import { ShipmentSaleOrderItem } from "./shipment-sale-order-item";


export class ShipmentSaleOrder extends EntityBase {
    readonly shipmentId: string;
    @Type(() => Shipment)
    readonly shipment: Shipment;

    saleOrderCode: string;
    sourceGeographicalKey: string;
    destinationGeographicalKey: string;

    @Type(() => ShipmentSaleOrderItem)
    items: ShipmentSaleOrderItem[];

    constructor(shipment?: Shipment) {
        super();
        if (shipment) {
            this.shipment = shipment;
            this.shipmentId = shipment.id;
        }
    }

    public addItem(configure: (item: ShipmentSaleOrderItem) => void): ShipmentSaleOrderItem {
        const item = new ShipmentSaleOrderItem(this);
        configure(item);

        if (!this.items?.length) {
            this.items = [];
        }
        this.items.push(item);
        return item;
    }
}
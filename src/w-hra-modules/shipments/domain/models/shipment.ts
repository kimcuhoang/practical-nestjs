import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { Type } from "class-transformer";
import { ShipmentSaleOrder } from "./shipment-sale-order";

export enum ShipmentStatus {
    STATUS0 = "STATUS0",
    STATUS10 = "STATUS10",
    STATUS11 = "STATUS11",
    STATUS24 = "STATUS24",
    STATUS25 = "STATUS25",
    STATUS30 = "STATUS30",
    STATUS60 = "STATUS60",
    STATUS70 = "STATUS70"
}


export class Shipment extends EntityBase {
    shipmentCode: string;
    bizUnitCode: string;
    regionCode: string;
    status: ShipmentStatus;

    startFromDateTime: Date;
    finishToDateTime: Date;

    sourceGeographyCode: string;
    destinationGeographyCode: string;

    @Type(() => ShipmentSaleOrder)
    saleOrders: ShipmentSaleOrder[];

    constructor(configure?: (shipment: Shipment) => void) {
        super();
        configure?.(this);
    }

    public addSaleOrder(configure: (order: ShipmentSaleOrder) => void): Shipment {
        const saleOrder = new ShipmentSaleOrder(this);
        configure(saleOrder);

        if (!this.saleOrders?.length) {
            this.saleOrders = [];
        }
        this.saleOrders.push(saleOrder);
        return this;
    }
}
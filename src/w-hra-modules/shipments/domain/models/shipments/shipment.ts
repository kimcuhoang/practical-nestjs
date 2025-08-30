import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { Type } from "class-transformer";
import { ShipmentSaleOrder } from "./shipment-sale-order";


export class Shipment extends EntityBase {
    shipmentCode: string;
    bizUnitCode: string;
    regionCode: string;

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
import { PickType } from "@nestjs/swagger";
import { Shipment, ShipmentSaleOrder, ShipmentSaleOrderItem } from "@src/w-hra-modules/shipments/domain";
import { Type } from "class-transformer";

export class CreateShipmentSaleOrderItemPayload 
    extends PickType(ShipmentSaleOrderItem, [ 
        "productCode",
        "quantity",
     ] as const) {}

export class CreateShipmentSaleOrderPayload 
    extends PickType(ShipmentSaleOrder, [ 
        "saleOrderCode",
        "sourceGeographicalKey",
        "destinationGeographicalKey",
     ] as const) {
        
    @Type(() => CreateShipmentSaleOrderItemPayload)
    items: CreateShipmentSaleOrderItemPayload[];
}

export class CreateShipmentPayload 
    extends PickType(Shipment, [ 
        "bizUnitCode",
        "regionCode",
        "startFromDateTime",
        "finishToDateTime",
        "sourceGeographyCode",
        "destinationGeographyCode",
     ] as const) {

    @Type(() => CreateShipmentSaleOrderPayload)
    saleOrders: CreateShipmentSaleOrderPayload[];
}
import { PickType } from "@nestjs/swagger";
import { SaleOrder, SaleOrderItem } from "@src/w-hra-modules/sale-orders/domain";
import { Type } from "class-transformer";


export class CreateSaleOrderPayload 
    extends PickType(SaleOrder, ["saleOrderCode", "sourceGeographicalKey", "destinationGeographicalKey", "regionCode"] as const) {

    @Type(() => CreateSaleOrderItemPayload)
    items: CreateSaleOrderItemPayload[];
}

export class CreateSaleOrderItemPayload 
    extends PickType(SaleOrderItem, [ "productKey", "quantity" ] as const) { }
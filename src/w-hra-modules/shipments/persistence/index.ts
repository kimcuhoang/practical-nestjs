import { BizUnitRegionSchema } from "./schemas/biz-units/biz-unit-region.schema";
import { BizUnitSchema } from "./schemas/biz-units/biz-unit.schema";
import { ShipmentSaleOrderItemSchema } from "./schemas/shipments/shipment-sale-order-item.schema";
import { ShipmentSaleOrderSchema } from "./schemas/shipments/shipment-sale-order.schema";
import { ShipmentSchema } from "./schemas/shipments/shipment.schema";


export const ShipmentsModuleSchemas = [
    BizUnitSchema,
    BizUnitRegionSchema,
    ShipmentSchema,
    ShipmentSaleOrderSchema,
    ShipmentSaleOrderItemSchema
];
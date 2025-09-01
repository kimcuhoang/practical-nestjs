import { ShipmentSaleOrderItemSchema } from "./schemas/shipment-sale-order-item.schema";
import { ShipmentSaleOrderSchema } from "./schemas/shipment-sale-order.schema";
import { ShipmentSchema } from "./schemas/shipment.schema";


export const ShipmentsModuleSchemas = [
    ShipmentSchema,
    ShipmentSaleOrderSchema,
    ShipmentSaleOrderItemSchema
];
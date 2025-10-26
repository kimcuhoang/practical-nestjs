import { SaleOrderItemSchema } from "./schemas/sale-order-item.schema";
import { SaleOrderShipmentHistorySchema } from "./schemas/sale-order-shipment-history.schema";
import { SaleOrderSchema } from "./schemas/sale-order.schema";

export const SaleOrderModuleSchemas = [
    SaleOrderSchema,
    SaleOrderItemSchema,
    SaleOrderShipmentHistorySchema
];
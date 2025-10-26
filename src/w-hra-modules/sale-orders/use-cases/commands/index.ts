import { AssignShipmentHandler } from "./assign-shipment/assign-shipment.handler";
import { CreateSaleOrderHandler } from "./create/create-sale-order.handler";

export * from "./create/create-sale-order.payload";
export * from "./create/create-sale-order.command";

export * from "./assign-shipment/assign-shipment.command";

export const CqrsCommandHandlers = [
    CreateSaleOrderHandler,
    AssignShipmentHandler
];
import { CreateSaleOrderHandler } from "./create/create-sale-order.handler";

export * from "./create/create-sale-order.payload";
export * from "./create/create-sale-order.command";

export const CqrsCommandHandlers = [
    CreateSaleOrderHandler
];
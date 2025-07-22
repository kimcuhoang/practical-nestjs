import { VerifySaleOrderHandler } from "./verify-sale-orders/verify-sale-orders.handler";

export * from "./verify-sale-orders/verify-sale-orders.request";

export const CqrsQueryHandlers = [
    VerifySaleOrderHandler
];
import { SaleOrderModuleSchemas } from "./sale-orders/persistence";
import { SaleOrdersModule } from "./sale-orders/sale-orders.module";

export * from "./sale-orders/sale-orders.module";

export const WhraModuleSchemas = [
    ...SaleOrderModuleSchemas
];
import { BizPartnersModuleSchemas } from "./biz-partners/persistence";
import { SaleOrderModuleSchemas } from "./sale-orders/persistence";
import { ShipmentsModuleSchemas } from "./shipments/persistence";

export * from "./sale-orders/sale-orders.module";
export * from "./shipments/shipments.module";
export * from "./biz-partners/biz-partners.module";

export const WhraModuleSchemas = [
    ...SaleOrderModuleSchemas,
    ...ShipmentsModuleSchemas,
    ...BizPartnersModuleSchemas
];
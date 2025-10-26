import { BizPartnersModuleSchemas } from "./biz-partners/persistence";
import { BizUnitsModuleSchemas } from "./biz-units/persistence";
import { CustomersModuleSchemas } from "./customers/persistence";
import { SaleOrderModuleSchemas } from "./sale-orders/persistence";
import { ShipmentLanesModuleSchemas } from "./shipment-lanes/persistence";
import { ShipmentsModuleSchemas } from "./shipments/persistence";

export * from "./biz-units/biz-units.module";
export * from "./sale-orders/sale-orders.module";
export * from "./shipments/shipments.module";
export * from "./biz-partners/biz-partners.module";
export * from "./customers/customers.module";
export * from "./shipment-lanes/shipment-lanes.module";

export const WhraModuleSchemas = [
    ...SaleOrderModuleSchemas,
    ...Object.values(ShipmentsModuleSchemas),
    ...BizPartnersModuleSchemas,
    ...CustomersModuleSchemas,
    ...BizUnitsModuleSchemas,
    ...Object.values(ShipmentLanesModuleSchemas)
];
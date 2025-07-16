import { CreateBizUnitHandler } from "./biz-units/create/create-biz-unit.handler";
import { CreateShipmentHandler } from "./shipments/create/create-shipment.handler";


export * from "./biz-units/create/create-biz-unit.payload";
export * from "./biz-units/create/create-biz-unit.command";


export * from "./shipments/create/create-shipment.payload";
export * from "./shipments/create/create-shipment.command";


export const CqrsCommandHandlers = [
    CreateBizUnitHandler,
    CreateShipmentHandler,
];
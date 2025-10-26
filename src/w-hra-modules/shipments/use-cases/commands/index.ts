import { CreateShipmentHandler } from "./create/create-shipment.handler";


export * from "./create/create-shipment.payload";
export * from "./create/create-shipment.command";


export const CqrsCommandHandlers = [
    CreateShipmentHandler,
];
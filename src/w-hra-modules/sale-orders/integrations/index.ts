import { ShipmentAssignedHandler } from "./shipment-assigned/shipment-assigned.handler";

export * from "./shipment-assigned/shipment-assigned.event";

export const EventHandlers = [
    ShipmentAssignedHandler
];
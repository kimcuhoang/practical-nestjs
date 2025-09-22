import { ShipmentLaneSchema } from "./schemas/shipment-lane.schema";
import { ShipmentLaneSubscriber } from "./subscribers/shipment-lane.subscriber";


export const ShipmentLanesModuleSchemas  = {
    ShipmentLaneSchema
};

export const ShipmentLanesModuleEntitySubscribers = {
    ShipmentLaneSubscriber
};

export * from "./sequences";
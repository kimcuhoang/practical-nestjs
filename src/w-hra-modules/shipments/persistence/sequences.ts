import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const ShipmentsSequences = {
    shipmentSequence: new SnakeNamingStrategy().tableName("ShipmentSequence", ""),
};


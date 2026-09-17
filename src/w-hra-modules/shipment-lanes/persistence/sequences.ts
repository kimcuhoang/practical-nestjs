import { SnakeNamingStrategy } from "typeorm-naming-strategies";


export const ShipmentLaneSequence = new SnakeNamingStrategy().tableName("ShipmentLaneSequence", "");
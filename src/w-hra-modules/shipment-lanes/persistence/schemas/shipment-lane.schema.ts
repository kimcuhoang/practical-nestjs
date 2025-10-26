import { EntitySchema } from "typeorm";
import { ShipmentLane } from "../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";


export const ShipmentLaneSchema = new EntitySchema<ShipmentLane>({
    name: ShipmentLane.name,
    target: ShipmentLane,
    tableName: snakeCase("ShipmentLanes"),
    columns: {
        ...EntityBaseSchema,
        code: {
            type: String,
            nullable: true
        }
    }
});
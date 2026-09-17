import { EntitySchema } from "typeorm";
import { ShipmentLane, Tariff } from "../../domain";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const ShipmentLaneSchema = new EntitySchema<ShipmentLane>({
    name: ShipmentLane.name,
    target: ShipmentLane,
    tableName: snakeCaseStrategy.tableName("ShipmentLanes", ""),
    columns: {
        ...EntityBaseSchema,
        code: {
            type: String,
            nullable: false
        },
        description: {
            type: String,
            nullable: true
        }
    
    },
    relations: {
        tariffs: {
            type: "one-to-many",
            target: Tariff.name,
            inverseSide: "shipmentLane",
            cascade: true
        }
    }
});
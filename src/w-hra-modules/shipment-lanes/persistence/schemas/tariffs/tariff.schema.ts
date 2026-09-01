import { EntitySchema } from "typeorm";
import { ShipmentLane, Tariff, TariffValidity } from "../../../domain";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";

const snakeCaseStrategy = new SnakeNamingStrategy();
export const TariffSchema = new EntitySchema<Tariff>({
    name: Tariff.name,
    target: Tariff,
    tableName: snakeCaseStrategy.tableName("Tariffs", ""),
    columns: {
        ...EntityBaseSchema,
        code: {
            type: String,
            nullable: false
        },
        bizPartnerCode: {
            type: String,
            nullable: false
        },
        preferred: {
            type: Boolean,
            nullable: false
        },
        shipmentLaneId: {
            type: String,
            nullable: false
        }
    },
    relations: {
        shipmentLane: {
            type: "many-to-one",
            target: ShipmentLane.name,
            inverseSide: "tariffs",
            onDelete: "CASCADE",
            orphanedRowAction: "delete",
            joinColumn: {
                name: snakeCaseStrategy.columnName("shipmentLaneId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "Tariffs",
                    ["shipmentLaneId"],
                    "ShipmentLanes",
                    ["id"]
                )
            }
        },
        validities: {
            type: "one-to-many",
            target: TariffValidity.name,
            inverseSide: "tariff",
            cascade: true
        }
    }
});
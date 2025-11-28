import { EntitySchema } from "typeorm";
import { ShipmentLane, Tariff, TariffValidity } from "../../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";


export const TariffSchema = new EntitySchema<Tariff>({
    name: Tariff.name,
    target: Tariff,
    tableName: snakeCase("Tariffs"),
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
                name: snakeCase("shipmentLaneId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCase("FK_Tariff_ShipmentLane")
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
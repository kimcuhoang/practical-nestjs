import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { EntitySchema } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { TariffValidity, Tariff, BaseRate } from "../../../domain";

const snakeCaseStrategy = new SnakeNamingStrategy();
export const TariffValiditySchema = new EntitySchema<TariffValidity>({
    name: TariffValidity.name,
    target: TariffValidity,
    tableName: snakeCaseStrategy.tableName("TariffValidities", ""),
    columns: {
        ...EntityBaseSchema,
        tariffId: {
            type: String,
            nullable: false
        },
        validFrom: {
            type: Date,
            nullable: false
        },
        validTo: {
            type: Date,
            nullable: true
        }
    },
    relations: {
        tariff: {
            type: "many-to-one",
            target: Tariff.name,
            inverseSide: "validities",
            onDelete: "CASCADE",
            orphanedRowAction: "delete",
            joinColumn: {
                name: snakeCaseStrategy.columnName("tariffId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "TariffValidities",
                    ["tariffId"],
                    "Tariffs",
                    ["id"]
                )
            }
        },
        baseRates: {
            type: "one-to-many",
            target: BaseRate.name,
            inverseSide: "tariffValidity",
            cascade: true
        }
    }
});
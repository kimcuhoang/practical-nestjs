import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { EntitySchema } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { BaseRate, BaseRateValue, TariffValidity } from "../../../../domain";

const snakeCaseStrategy = new SnakeNamingStrategy();
export const BaseRateSchema = new EntitySchema<BaseRate>({
    name: BaseRate.name,
    target: BaseRate,
    tableName: snakeCaseStrategy.tableName("BaseRates", ""),
    columns: {
        ...EntityBaseSchema,
        tariffValidityId: {
            type: String,
            nullable: false
        },
        baseRateType: {
            type: String,
            nullable: false
        },
    },
    relations: {
        tariffValidity: {
            type: "many-to-one",
            target: TariffValidity.name,
            inverseSide: "baseRates",
            onDelete: "CASCADE",
            orphanedRowAction: "delete",
            joinColumn: {
                name: snakeCaseStrategy.columnName("tariffValidityId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "BaseRates",
                    ["tariffValidityId"],
                    "TariffValidities",
                    ["id"]
                )
            }
        },
        values: {
            type: "one-to-many",
            target: BaseRateValue.name,
            inverseSide: "baseRate",
            cascade: true
        }
    },
    inheritance: {
        pattern: "STI",
        column: "baseRateType"
    }
});


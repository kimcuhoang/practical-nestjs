import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { EntitySchema } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { BaseRate, BaseRateValue } from "../../../../domain";

const snakeCaseStrategy = new SnakeNamingStrategy();
export const BaseRateValueSchema = new EntitySchema<BaseRateValue>({
    name: BaseRateValue.name,
    target: BaseRateValue,
    tableName: snakeCaseStrategy.tableName("BaseRateValues", ""),
    columns: {
        ...EntityBaseSchema,
        baseRateType: {
            type: String,
            nullable: false
        },
        baseRateId: {
            type: String,
            nullable: false
        },
        value: {
            type: "float",
            nullable: false
        },
    },
    relations: {
        baseRate: {
            type: "many-to-one",
            target: BaseRate.name,
            inverseSide: "values",
            onDelete: "CASCADE",
            orphanedRowAction: "delete",
            joinColumn: {
                name: snakeCaseStrategy.columnName("baseRateId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "BaseRateValues",
                    ["baseRateId"],
                    "BaseRates",
                    ["id"]
                )
            }
        }
    },
    inheritance: {
        pattern: "STI",
        column: "baseRateType"
    }
});


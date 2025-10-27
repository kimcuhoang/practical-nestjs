import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";
import { BaseRate, BaseRateValue } from "../../../../domain";

export const BaseRateValueSchema = new EntitySchema<BaseRateValue>({
    name: BaseRateValue.name,
    target: BaseRateValue,
    tableName: snakeCase("BaseRateValues"),
    columns: {
        ...EntityBaseSchema,
        baseRateType: {
            type: String,
            nullable: false
        },
        baseRateId: {
            type: String,
            nullable: false
        }
    },
    relations: {
        baseRate: {
            type: "many-to-one",
            target: BaseRate.name,
            inverseSide: "values",
            onDelete: "CASCADE",
            orphanedRowAction: "delete",
            joinColumn: {
                name: snakeCase("baseRateId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCase("FK_BaseRateValue_BaseRate")
            }
        }
    },
    inheritance: {
        pattern: "STI",
        column: "baseRateType"
    }
});


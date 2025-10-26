import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";
import { BaseRate, BaseRateValue, TariffValidity } from "../../../../domain";

export const BaseRateSchema = new EntitySchema<BaseRate>({
    name: BaseRate.name,
    target: BaseRate,
    tableName: snakeCase("BaseRates"),
    columns: {
        ...EntityBaseSchema,
        tariffValidityId: {
            type: String,
            nullable: false
        },
        baseRateType: {
            type: String,
            nullable: false
        }
    },
    relations: {
        tariffValidity: {
            type: "many-to-one",
            target: TariffValidity.name,
            inverseSide: "baseRates",
            cascade: true,
            onDelete: "CASCADE",
            orphanedRowAction: "delete",
            joinColumn: {
                name: snakeCase(BaseRate.prototype.tariffValidityId),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCase("FK_BaseRate_TariffValidity")
            }
        },
        values: {
            type: "one-to-many",
            target: BaseRateValue.name,
            inverseSide: "baseRate",
            cascade: true
        }
    },
    // inheritance: {
    //     pattern: "STI",
    //     column: BaseRate.prototype.baseRateType
    // }
});


import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";
import { TariffValidity, Tariff, BaseRate } from "../../../domain";


export const TariffValiditySchema = new EntitySchema<TariffValidity>({
    name: TariffValidity.name,
    target: TariffValidity,
    tableName: snakeCase("TariffValidities"),
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
                name: snakeCase("tariffId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCase("FK_TariffValidity_Tariff")
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
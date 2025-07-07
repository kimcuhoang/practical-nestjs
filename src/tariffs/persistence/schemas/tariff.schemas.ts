import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { Surcharge } from "@src/tariffs/domain/models/surcharge.entities";
import { StandardChargeValidity, Tariff } from "@src/tariffs/domain/models/tariff";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";


export const TariffSchema = new EntitySchema<Tariff>({
    name: Tariff.name,
    tableName: snakeCase("Tariffs"),
    columns: {
        ...EntityBaseSchema,
        name: {
            type: String,
            nullable: false,
            length: 300
        }
    },
    relations: {
        surchages: {
            type: "one-to-many",
            target: Surcharge.name,
            inverseSide: "tariff",
            // below to make the save action work correctly
            cascade: true,
            onDelete: "CASCADE"
        },
        validities: {
            type: "one-to-many",
            target: StandardChargeValidity.name,
            inverseSide: "tariff",
            // below to make the save action work correctly
            cascade: true,
            onDelete: "CASCADE"
        }
    }
});

export const StandardChargeValiditySchema = new EntitySchema<StandardChargeValidity>({
    name: StandardChargeValidity.name,
    tableName: snakeCase("StandardChargeValidities"),
    columns: {
        ...EntityBaseSchema,
        amount: {
            type: Number,
            nullable: false
        },
        startDate: {
            type: Date,
            nullable: false
        },
        endDate: {
            type: Date,
            nullable: true
        },
        tariffId: {
            type: String,
            nullable: false,
            length: 26, // ulid length
        }
    },
    relations: {
        tariff: {
            type: "many-to-one",
            target: Tariff.name,
            inverseSide: "validities",
            joinColumn: {
                name: "tariffId",
                referencedColumnName: "id",
                foreignKeyConstraintName: 'FK_StandardChargeValidity_Tariff'
            },
            onDelete: "CASCADE"
        }
    }
});
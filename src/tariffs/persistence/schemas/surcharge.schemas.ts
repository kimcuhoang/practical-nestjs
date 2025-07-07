import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { Surcharge, SurchargeArguments } from "@src/tariffs/domain/models/surcharge.entities";
import { Tariff } from "@src/tariffs/domain/models/tariff";
import { EntitySchema } from "typeorm";

const SurchargeArgumentsSchema = new EntitySchema<SurchargeArguments>({
    name: SurchargeArguments.name,
    columns: {
        maxAmountOfStops: {
            type: Number,
            nullable: true,
        },
        peakSeasonStart: {
            type: Date,
            nullable: true,
        },
        peakSeasonEnd: {
            type: Date,
            nullable: true,
        },
    }
});

export const SurchargeSchema = new EntitySchema<Surcharge>({
    name: Surcharge.name,
    target: Surcharge,
    columns: {
        ...EntityBaseSchema,
        surchargeType: {
            type: String,
            nullable: false,
        },
        amount: {
            type: Number,
            nullable: false,
        },
    },
    embeddeds: {
        arguments: {
            schema: SurchargeArgumentsSchema,
            prefix: "",
        }
    },
    relations: {
        tariff: {
            type: "many-to-one",
            target: Tariff.name,
            inverseSide: "surcharges"
    }
});


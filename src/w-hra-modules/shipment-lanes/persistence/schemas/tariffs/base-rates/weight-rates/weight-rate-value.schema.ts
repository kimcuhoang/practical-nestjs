import { WeightRateValue, BaseRateType } from "@src/w-hra-modules/shipment-lanes/domain";
import { EntitySchema } from "typeorm";
import { BaseRateValueSchema } from "../base-rate-value.schema";

export const WeightRateValueSchema = new EntitySchema<WeightRateValue>({
    name: WeightRateValue.name,
    target: WeightRateValue,
    type: "entity-child",
    discriminatorValue: BaseRateType.WEIGHT,
    columns: {
        ...BaseRateValueSchema.options.columns,
        value: {
            type: "float",
            nullable: false
        },
        perSegment: {
            type: "integer",
            nullable: false
        },
        segmentUnit: {
            type: String,
            nullable: false
        }
    },
    relations: {
        baseRate: {
            ...BaseRateValueSchema.options.relations.baseRate,
            target: WeightRateValue.name
        }
    }
});
import { WeightRate, BaseRateType } from "@src/w-hra-modules/shipment-lanes/domain";
import { EntitySchema } from "typeorm";
import { BaseRateSchema } from "../base-rate.schema";

export const WeightRateSchema = new EntitySchema<WeightRate>({
    name: WeightRate.name,
    target: WeightRate,
    type: "entity-child",
    discriminatorValue: BaseRateType.WEIGHT,
    columns: {
        ...BaseRateSchema.options.columns,
    },
    relations: {
        ...BaseRateSchema.options.relations
    }
});
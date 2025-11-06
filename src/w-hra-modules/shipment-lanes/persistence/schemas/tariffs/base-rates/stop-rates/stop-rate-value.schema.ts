import {  BaseRateType, StopRateValue } from "@src/w-hra-modules/shipment-lanes/domain";
import { EntitySchema } from "typeorm";
import { BaseRateValueSchema } from "../base-rate-value.schema";

export const StoptRateValueSchema = new EntitySchema<StopRateValue>({
    name: StopRateValue.name,
    target: StopRateValue,
    type: "entity-child",
    discriminatorValue: BaseRateType.STOP,
    columns: {
        ...BaseRateValueSchema.options.columns,
        perNumberOfStops: {
            type: "int",
            nullable: false
        }
    },
    relations: {
        baseRate: {
            ...BaseRateValueSchema.options.relations.baseRate,
            target: StopRateValue.name
        }
    }
});
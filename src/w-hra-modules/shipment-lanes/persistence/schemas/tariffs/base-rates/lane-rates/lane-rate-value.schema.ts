import {  BaseRateType, LaneRateValue } from "@src/w-hra-modules/shipment-lanes/domain";
import { EntitySchema } from "typeorm";
import { BaseRateValueSchema } from "../base-rate-value.schema";

export const LaneRateValueSchema = new EntitySchema<LaneRateValue>({
    name: LaneRateValue.name,
    target: LaneRateValue,
    type: "entity-child",
    discriminatorValue: BaseRateType.LANE,
    columns: {
        ...BaseRateValueSchema.options.columns
    }
});
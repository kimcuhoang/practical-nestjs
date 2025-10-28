import { BaseRateType, LaneRate } from "@src/w-hra-modules/shipment-lanes/domain";
import { EntitySchema } from "typeorm";
import { BaseRateSchema } from "../base-rate.schema";

export const LaneRateSchema = new EntitySchema<LaneRate>({
    name: LaneRate.name,
    target: LaneRate,
    type: "entity-child",
    discriminatorValue: BaseRateType.LANE,
    columns: {
        ...BaseRateSchema.options.columns,
    }
});
import { BaseRateType, StopRate } from "@src/w-hra-modules/shipment-lanes/domain";
import { EntitySchema } from "typeorm";
import { BaseRateSchema } from "../base-rate.schema";

export const StopRateSchema = new EntitySchema<StopRate>({
    name: StopRate.name,
    target: StopRate,
    type: "entity-child",
    discriminatorValue: BaseRateType.STOP,
    columns: {
        ...BaseRateSchema.options.columns,
    }
});
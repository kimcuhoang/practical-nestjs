import { BaseRateValue } from "../base-rate-value";
import { WeightRate } from "./weight-rate";


export class WeightRateValue extends BaseRateValue {

    value!: number;
    perSegment!: number;
    segmentUnit!: "kg" | "lb";

    constructor(baseRate?: WeightRate) {
        super(baseRate);
    }
}
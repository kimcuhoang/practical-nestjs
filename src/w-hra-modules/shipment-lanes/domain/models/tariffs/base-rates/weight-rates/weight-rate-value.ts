import { BaseRate } from "../base-rate";
import { BaseRateValue } from "../base-rate-value";


export class WeightRateValue extends BaseRateValue {

    value!: number;
    perSegment!: number;
    segmentUnit!: "kg" | "lb";

    constructor(baseRate?: BaseRate, options?: Pick<WeightRateValue, 'value' | 'perSegment' | 'segmentUnit'>) {
        super(baseRate);
        Object.assign(this, options);
        baseRate?.addBaseRateValue(this);
    }
}
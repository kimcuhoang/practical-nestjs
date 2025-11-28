import { BaseRate } from "../base-rate";
import { BaseRateValue } from "../base-rate-value";


export class WeightRateValue extends BaseRateValue {

    perSegment!: number;
    segmentUnit!: "kg" | "lb";

    constructor(baseRate?: BaseRate, options?: Pick<WeightRateValue, 'value' | 'perSegment' | 'segmentUnit'>) {
        super(baseRate, options);
        Object.assign(this, options);
        baseRate?.addBaseRateValue(this);
    }
}
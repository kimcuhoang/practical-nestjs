import { BaseRate } from "../base-rate";
import { BaseRateValue } from "../base-rate-value";


export class LaneRateValue extends BaseRateValue {
    
    constructor(baseRate?: BaseRate, options?: Pick<LaneRateValue, 'value'>) {
        super(baseRate, options);
        Object.assign(this, options);
        baseRate?.addBaseRateValue(this);
    }
}
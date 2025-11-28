import { BaseRate } from "../base-rate";
import { BaseRateValue } from "../base-rate-value";


export class StopRateValue extends BaseRateValue {
    perNumberOfStops!: number;
    
    constructor(baseRate?: BaseRate, options?: Pick<StopRateValue, 'value' | 'perNumberOfStops'>) {
        super(baseRate, options);
        Object.assign(this, options);
        baseRate?.addBaseRateValue(this);
    }
}
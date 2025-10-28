import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { BaseRate } from "./base-rate";


export abstract class BaseRateValue extends EntityBase {

    baseRate: BaseRate;
    baseRateId!: string;
    baseRateType!: string;
    value!: number;

    constructor(baseRate?: BaseRate, options?: Pick<BaseRateValue, 'value'>) {
        super();
        Object.assign(this, {
            ...options,
            baseRate: baseRate,
            baseRateId: baseRate?.id,
            baseRateType: baseRate?.baseRateType
        });
    }
}
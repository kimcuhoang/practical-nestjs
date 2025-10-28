import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { BaseRate, BaseRateType } from "./base-rate";


export abstract class BaseRateValue extends EntityBase {
    readonly baseRate: BaseRate;
    readonly baseRateId!: string;
    readonly baseRateType!: BaseRateType;
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
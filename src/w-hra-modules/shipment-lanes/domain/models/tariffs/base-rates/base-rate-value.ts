import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { BaseRate } from "./base-rate";


export class BaseRateValue extends EntityBase {

    baseRateId!: string;
    baseRate: BaseRate;
    baseRateType!: string;

    constructor(baseRate?: BaseRate) {
        super();
        Object.assign(this, {
            baseRateId: baseRate?.id,
            baseRate: baseRate,
            baseRateType: baseRate?.baseRateType
        });
    }
}
import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { BaseRate } from "./base-rate";


export class BaseRateValue extends EntityBase {

    baseRate: BaseRate;
    baseRateId!: string;
    baseRateType!: string;

    constructor(baseRate?: BaseRate) {
        super();
        Object.assign(this, {
            baseRate: baseRate,
            baseRateId: baseRate?.id,
            baseRateType: baseRate?.baseRateType
        });
    }
}
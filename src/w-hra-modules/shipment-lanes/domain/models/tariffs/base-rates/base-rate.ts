import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { TariffValidity } from "../tariff-validity";
import { BaseRateValue } from "./base-rate-value";

export enum BaseRateType {
    WEIGHT = "WEIGHT",
    VOLUME = "VOLUME",
}

export class BaseRate extends EntityBase {
    
    tariffValidityId!: string;
    tariffValidity!: TariffValidity;

    baseRateType!: BaseRateType;

    values: BaseRateValue[];

    constructor(tariffValidity?: TariffValidity, baseRateType?: BaseRateType) {
        super();
        Object.assign(this, {
            tariffValidityId: tariffValidity?.id,
            tariffValidity: tariffValidity,
            baseRateType: baseRateType
        });
    }

    public addBaseRateValue<T extends BaseRateValue>(): T {
        this.values ??= [];
        const baseRateValue = new BaseRateValue(this) as T;
        this.values.push(baseRateValue);

        return baseRateValue;
    }
}
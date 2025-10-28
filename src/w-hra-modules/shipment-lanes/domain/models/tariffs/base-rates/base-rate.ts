import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { TariffValidity } from "../tariff-validity";
import { BaseRateValue } from "./base-rate-value";

export enum BaseRateType {
    WEIGHT = "WEIGHT",
    STOP = "STOP",
    LANE = "LANE",
}

export abstract class BaseRate extends EntityBase {
    
    readonly tariffValidityId!: string;
    readonly tariffValidity!: TariffValidity;
    abstract readonly baseRateType: BaseRateType;

    values: BaseRateValue[];

    constructor(tariffValidity?: TariffValidity) {
        super();
        Object.assign(this, {
            tariffValidityId: tariffValidity?.id,
            tariffValidity: tariffValidity,
        });
    }

    public addBaseRateValue<T extends BaseRateValue>(baseRateValue: T): void {
        this.values ??= [];
        this.values.push(baseRateValue);
    }
}
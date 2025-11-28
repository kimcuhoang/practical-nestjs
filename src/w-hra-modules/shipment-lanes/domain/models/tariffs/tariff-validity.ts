import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { Tariff } from "./tariff";
import { BaseRate } from "./base-rates/base-rate";


export class TariffValidity extends EntityBase {

    tariffId!: string;
    tariff!: Tariff;
    
    validFrom!: Date;
    validTo?: Date;

    baseRates: BaseRate[];

    constructor(tariff?: Tariff, validity?: Pick<TariffValidity, 'validFrom' | 'validTo'>) {
        super();
        Object.assign(this, {
            tariffId: tariff?.id,
            tariff: tariff,
            ...validity
        });
    }

    public addBaseRate<T extends BaseRate>(baseRate: T): void {
        this.baseRates ??= [];
        this.baseRates.push(baseRate);
    }
}
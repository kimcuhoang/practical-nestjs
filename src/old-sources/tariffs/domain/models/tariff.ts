import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Surcharge } from "./surcharge.entities";
import { Type } from "class-transformer";
import { ulid } from "ulidx";


export class Tariff extends EntityBase {

    constructor(partial?: Partial<Tariff>) {
        super(partial?.id ?? ulid());
        Object.assign(this, partial);
        this.validities = [];
        this.surchages = [];
    }

    name: string;

    @Type(() => StandardChargeValidity)
    validities: StandardChargeValidity[];

    @Type(() => Surcharge)
    surchages: Surcharge[];

    public addValidity(partial: Partial<StandardChargeValidity>): Tariff {
        const validity = new StandardChargeValidity(this, partial);
        this.validities.push(validity);
        return this
    }

    public addSurcharge(partial: Partial<Surcharge>): Tariff {
        const surcharge = new Surcharge(this, partial);
        this.surchages.push(surcharge);
        return this;
    }
}

export class StandardChargeValidity extends EntityBase {

    tariffId: string;

    @Type(() => Tariff)
    tariff: Tariff;

    @Type(() => Date)
    startDate: Date;

    @Type(() => Date)
    endDate: Date;

    @Type(() => Number)
    amount: number;

    constructor(tariff: Tariff, partial?: Partial<StandardChargeValidity>) {
        super(partial?.id ?? ulid());
        Object.assign(this, partial);
        this.tariff = tariff;
        this.tariffId = tariff.id;
    }
}
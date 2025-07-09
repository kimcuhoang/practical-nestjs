import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { ulid } from "ulidx";
import { Tariff } from "./tariff";
import { Type } from "class-transformer";


export enum SurchargeType {
    PER_STOP = "PER_STOP",
    PEAK_SEASON_HOLIDAY = "PEAK_SEASON_HOLIDAY",
}

export class Surcharge extends EntityBase {
    readonly tariffId!: string;
    @Type(() => Tariff)
    readonly tariff!: Tariff;

    surchargeType!: SurchargeType;
    amount!: number;
    arguments?: SurchargeArguments;

    constructor(tariff: Tariff, partial: Partial<Surcharge>) {
        super(partial.id ?? ulid());
        Object.assign(this, partial);
        this.tariffId = tariff.id;
        this.tariff = tariff;
    }
}

export class SurchargeArguments {
    maxAmountOfStops?: number;
    peakSeasonStart?: Date;
    peakSeasonEnd?: Date;

    constructor(surchargeArguments: Partial<SurchargeArguments>) {
        Object.assign(this, surchargeArguments);
    }
}
import { TariffValidity } from "../../tariff-validity";
import { BaseRate, BaseRateType } from "../base-rate";

export class WeightRate extends BaseRate {

    constructor(tariffValidity?: TariffValidity) {
        super(tariffValidity, BaseRateType.WEIGHT);
        tariffValidity?.addBaseRate(this);
    }
}
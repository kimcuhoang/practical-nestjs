import { TariffValidity } from "../../tariff-validity";
import { BaseRate, BaseRateType } from "../base-rate";

export class WeightRate extends BaseRate {

    override readonly baseRateType = BaseRateType.WEIGHT;

    constructor(tariffValidity?: TariffValidity) {
        super(tariffValidity);
        tariffValidity?.addBaseRate(this);
    }
}
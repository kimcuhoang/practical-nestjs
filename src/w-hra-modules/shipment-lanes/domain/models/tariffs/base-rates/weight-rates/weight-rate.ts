import { TariffValidity } from "../../tariff-validity";
import { BaseRate, BaseRateType } from "../base-rate";
import { WeightRateValue } from "./weight-rate-value";

export class WeightRate extends BaseRate {

    constructor(tariffValidity?: TariffValidity) {
        super(tariffValidity, BaseRateType.WEIGHT);
    }
}
import { TariffValidity } from "../../tariff-validity";
import { BaseRate, BaseRateType } from "../base-rate";


export class StopRate extends BaseRate {
    constructor(tariffValidity?: TariffValidity) {
        super(tariffValidity, BaseRateType.STOP);
        tariffValidity?.addBaseRate(this);
    }
}
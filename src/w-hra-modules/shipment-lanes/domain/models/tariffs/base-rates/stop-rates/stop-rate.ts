import { TariffValidity } from "../../tariff-validity";
import { BaseRate, BaseRateType } from "../base-rate";


export class StopRate extends BaseRate {

    override readonly baseRateType = BaseRateType.STOP;
    
    constructor(tariffValidity?: TariffValidity) {
        super(tariffValidity);
        tariffValidity?.addBaseRate(this);
    }
}
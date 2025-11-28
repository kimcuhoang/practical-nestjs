import { BaseRate, BaseRateType, TariffValidity } from "@src/w-hra-modules/shipment-lanes/domain";

export class LaneRate extends BaseRate {

    override readonly baseRateType = BaseRateType.LANE;

    constructor(tariffValidity?: TariffValidity) {
        super(tariffValidity);
        tariffValidity?.addBaseRate(this);
    }
}
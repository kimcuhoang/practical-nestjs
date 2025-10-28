import { BaseRate, BaseRateType, TariffValidity } from "@src/w-hra-modules/shipment-lanes/domain";

export class LaneRate extends BaseRate {
    constructor(tariffValidity?: TariffValidity) {
        super(tariffValidity, BaseRateType.LANE);
        tariffValidity?.addBaseRate(this);
    }
}
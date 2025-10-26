import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { Type } from "class-transformer";
import { BizUnitRegion } from "./biz-unit-region";
import { CommonSettings } from "./value-objects/common-settings";
import { ShipmentKeySettings } from "./value-objects/shipment-key-settings";


export class BizUnit extends EntityBase {
    bizUnitCode!: string;

    @Type(() => CommonSettings)
    commonSettings!: CommonSettings;

    @Type(() => ShipmentKeySettings)
    shipmentKeySettings!: ShipmentKeySettings;

    @Type(() => BizUnitRegion)
    regions: BizUnitRegion[];

    constructor() {
        super();
    }

    public addBizUnitRegion(regionCode: string): BizUnit {
        const bizUnitRegion = new BizUnitRegion(this);
        bizUnitRegion.regionCode = regionCode;

        if (!this.regions?.length) {
            this.regions = [];
        }
        this.regions.push(bizUnitRegion);
        return this;
    }
}
import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { BizUnitRegion } from "./biz-unit-region";
import { BizUnitSettings } from "./biz-unit-settings";


export class BizUnit extends EntityBase {
    bizUnitCode!: string;

    @Type(() => BizUnitSettings)
    settings!: BizUnitSettings;

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
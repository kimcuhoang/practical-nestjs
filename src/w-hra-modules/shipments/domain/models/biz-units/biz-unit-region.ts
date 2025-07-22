import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { BizUnit } from "./biz-unit";


export class BizUnitRegion extends EntityBase {

    bizUnitId: string;
    @Type(() => BizUnit)
    bizUnit: BizUnit;

    regionCode: string;

    constructor(bizUnit?: BizUnit){
        super();
        if(bizUnit) {
            this.bizUnit = bizUnit;
            this.bizUnitId = bizUnit.id;
        }
    }
}
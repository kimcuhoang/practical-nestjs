import { PickType } from "@nestjs/swagger";
import { BizUnit, BizUnitRegion } from "@src/w-hra-modules/shipments/domain";
import { Type } from "class-transformer";

export class CreateBizUnitRegionPayload extends PickType(BizUnitRegion, ["regionCode"] as const) {}

export class CreateBizUnitPayload extends PickType(BizUnit, ["bizUnitCode", "settings"] as const) { 
    @Type(() => CreateBizUnitRegionPayload)
    regions: CreateBizUnitRegionPayload[];
}
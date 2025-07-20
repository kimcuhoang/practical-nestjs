import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class CreateBizUnitSettingsPayload {
    countryCode!: string;
    timeZone!: string;
}

export class CreateBizUnitRegionPayload {
    regionCode!: string;
}

export class CreateBizUnitPayload { 

    bizUnitCode!: string;

    @ValidateNested()
    @Type(() => CreateBizUnitSettingsPayload)
    settings!: CreateBizUnitSettingsPayload

    @ValidateNested({ each: true })
    @Type(() => CreateBizUnitRegionPayload)
    regions!: CreateBizUnitRegionPayload[];
}
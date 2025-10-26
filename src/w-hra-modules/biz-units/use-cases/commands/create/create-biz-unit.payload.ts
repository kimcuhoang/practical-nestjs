import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class CommonSettingsDto {
    countryCode!: string;
    timeZone!: string;
}

export class ShipmentKeySettingsDto {
    prefix!: string;
    sequenceStart!: string;
    sequenceEnd!: string;
}

export class ShipmentLaneKeySettingsDto {
    prefix!: string;
    template!: string;
}

export class CreateBizUnitRegionPayload {
    regionCode!: string;
}

export class CreateBizUnitPayload { 

    bizUnitCode!: string;

    @ValidateNested()
    @Type(() => CommonSettingsDto)
    commonSettings!: CommonSettingsDto;

    @ValidateNested()
    @Type(() => ShipmentKeySettingsDto)
    shipmentKeySettings!: ShipmentKeySettingsDto;

    @ValidateNested()
    @Type(() => ShipmentLaneKeySettingsDto)
    shipmentLaneKeySettings!: ShipmentLaneKeySettingsDto;

    @ValidateNested({ each: true })
    @Type(() => CreateBizUnitRegionPayload)
    regions!: CreateBizUnitRegionPayload[];
}
import { ICommand } from "@nestjs/cqrs";
import { PickType } from "@nestjs/swagger";
import { BizPartner, BizPartnerLocation } from "@src/new-sources/m-biz-partners/models";
import { Type } from "class-transformer";

export class CreateBizPartnerLocationPayload 
    extends PickType(BizPartnerLocation, [ "locationKey", "address" ] as const) { }

export class CreateBizPartnerPayload 
    extends PickType(BizPartner, ["bizPartnerKey", "name"] as const) {

    @Type(() => CreateBizPartnerLocationPayload)
    locations: CreateBizPartnerLocationPayload[] = []
}

export class CreateBizPartnerCommand implements ICommand {
    constructor(
        public readonly payload: CreateBizPartnerPayload
    ) {}
}
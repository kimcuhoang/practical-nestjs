import { BizPartnerGroup, BizPartnerRole } from "@src/w-hra-modules/biz-partners/domain";
import { Type } from "class-transformer";
import { IsEnum, ValidateNested } from "class-validator";
import { BizPartnerCustomerPayload } from "./biz-partner-customer.payload";
import { BizPartnerVendorPayload } from "./biz-partner-vendor.payload";
import { BizPartnerCommunicationPayload } from "./biz-parner-communication.payload";

export class BizPartnerPayload {
    name!: string;

    @IsEnum(BizPartnerGroup)
    group!: BizPartnerGroup;

    @IsEnum(BizPartnerRole)
    role!: BizPartnerRole;

    @Type(() => BizPartnerCommunicationPayload)
    @ValidateNested({ each: true })
    communications: BizPartnerCommunicationPayload[];

    @Type(() => BizPartnerCustomerPayload)
    @ValidateNested()
    customer: BizPartnerCustomerPayload;

    @Type(() => BizPartnerVendorPayload)
    @ValidateNested()
    vendor: BizPartnerVendorPayload;
}
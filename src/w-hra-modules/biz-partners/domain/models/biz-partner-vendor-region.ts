import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { BizPartnerVendor } from "./biz-partner-vendor";


export class BizPartnerVendorRegion extends EntityBase {
    readonly bizPartnerVendorId!: string;
    @Type(() => BizPartnerVendor)
    readonly bizPartnerVendor!: BizPartnerVendor;

    region!: string;

    constructor(bizPartnerVendor?: BizPartnerVendor){
        super();

        if (bizPartnerVendor) {
            this.bizPartnerVendor = bizPartnerVendor;
            this.bizPartnerVendorId = bizPartnerVendor.id;
        }
    }
}
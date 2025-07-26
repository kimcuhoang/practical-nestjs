import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { BizPartnerVendorRegion } from "./biz-partner-vendor-region";
import { Type } from "class-transformer";
import { BizPartner } from "./biz-partner";


export class BizPartnerVendor extends EntityBase {
    @Type(() => BizPartner)
    readonly bizPartner!: BizPartner;

    code!: string;
    shipmentVendorFlag!: boolean;

    @Type(() => BizPartnerVendorRegion)
    regions!: BizPartnerVendorRegion[];

    constructor(bizPartner?: BizPartner) {
        super();

        if (bizPartner) {
            this.bizPartner = bizPartner;
            this.id = bizPartner.id;
        }
    }

    public assignToRegion(region: string): BizPartnerVendor {
        const customerRegion = new BizPartnerVendorRegion(this);
        customerRegion.region = region;

        if (!this.regions?.length) {
            this.regions = [];
        }
        this.regions.push(customerRegion);

        return this;
    }
}
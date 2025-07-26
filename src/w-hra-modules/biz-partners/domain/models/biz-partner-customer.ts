import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { BizPartnerCustomerRegion } from "./biz-partner-customer-region";
import { BizPartner } from "./biz-partner";


export class BizPartnerCustomer extends EntityBase {
    @Type(() => BizPartner)
    readonly bizPartner!: BizPartner;

    code!: string;

    @Type(() => BizPartnerCustomerRegion)
    regions!: BizPartnerCustomerRegion[];

    constructor(bizPartner?: BizPartner) {
        super();

        if(bizPartner) {
            this.bizPartner = bizPartner;
            this.id = bizPartner.id;
        }
    }

    public assignToRegion(region: string): BizPartnerCustomer {
        const customerRegion = new BizPartnerCustomerRegion(this);
        customerRegion.region = region;

        if (!this.regions?.length) {
            this.regions = [];
        }
        this.regions.push(customerRegion);

        return this;
    }
}
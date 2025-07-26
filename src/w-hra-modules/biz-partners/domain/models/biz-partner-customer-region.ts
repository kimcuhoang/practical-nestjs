import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { BizPartnerCustomer } from "./biz-partner-customer";


export class BizPartnerCustomerRegion extends EntityBase {
    readonly bizPartnerCustomerId!: string;
    @Type(() => BizPartnerCustomer)
    readonly bizPartnerCustomer!: BizPartnerCustomer;

    region!: string;

    constructor(bizPartnerCustomer?: BizPartnerCustomer) {
        super();

        if (bizPartnerCustomer){
            this.bizPartnerCustomer = bizPartnerCustomer;
            this.bizPartnerCustomerId = bizPartnerCustomer.id;
        }
    }
}
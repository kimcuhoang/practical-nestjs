import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { Type } from "class-transformer";
import { BizPartnerCustomer } from "./biz-partner-customer";
import { BizPartnerVendor } from "./biz-partner-vendor";
import { BizPartnerCommunication } from "./biz-partner-communication";

export enum BizPartnerGroup {
    A01 = "A01",
    A02 = "A02",
    A05 = "A05",
    A06 = "A06",
    A10 = "A10"
}

export enum BizPartnerRole {
    Customer = "1",
    Vendor = "2",
    CustomerAndVendor = "3"
}


export class BizPartner extends EntityBase {
    name!: string;
    group!: BizPartnerGroup;
    role!: BizPartnerRole;
    
    @Type(() => BizPartnerCustomer)
    customer: BizPartnerCustomer;

    @Type(() => BizPartnerVendor)
    vendor: BizPartnerVendor;

    @Type(() => BizPartnerCommunication)
    communications!: BizPartnerCommunication[];

    constructor(config?: (bizPartner: BizPartner) => void){ 
        super(); 
        config?.(this);
    }

    public constructCustomer(config: (customer: BizPartnerCustomer) => void): BizPartner {
        this.customer ??= new BizPartnerCustomer(this);
        config(this.customer);
        return this;
    }

    public constructVendor(config: (vendor: BizPartnerVendor) => void): BizPartner {
        this.vendor ??= new BizPartnerVendor(this);
        config(this.vendor);
        return this;
    }

    public addCommunication(config: (communication: BizPartnerCommunication) => void): BizPartner {
        const communication = new BizPartnerCommunication(this);
        config(communication);

        if(!this.communications?.length) {
            this.communications = [];
        }
        this.communications.push(communication);
        return this;
    }
}
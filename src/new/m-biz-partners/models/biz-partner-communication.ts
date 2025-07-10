import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { ulid } from "ulidx";
import { BizPartner } from "./biz-partner";

export enum BizPartnerCommunicationType {
    Email = "Email",
    Phone = "Phone"
}

export class BizPartnerCommunication extends EntityBase {

    readonly bizPartnerId: string;
    @Type(() => BizPartner)
    readonly bizPartner: BizPartner;

    communicationType: BizPartnerCommunicationType;
    value: string;
    
    constructor(bizPartner: BizPartner, partial: Partial<BizPartnerCommunication> = {}) {
        super(ulid());
        Object.assign(this, partial);
        this.bizPartnerId = bizPartner.id;
        this.bizPartner = bizPartner;
    }
}
import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { BizPartner } from "./biz-partner";
import { ulid } from "ulidx";
import { Type } from "class-transformer";

export class BizPartnerLocation extends EntityBase {
    
    readonly bizPartnerId: string;
    @Type(() => BizPartner)
    readonly bizPartner: BizPartner

    locationKey: string;
    address: string;

    constructor(bizPartner: BizPartner, partial: Partial<BizPartnerLocation> = {}) {
        super(ulid());
        Object.assign(this, partial);
        this.bizPartner = bizPartner;
        this.bizPartnerId = bizPartner.id;
    }
}
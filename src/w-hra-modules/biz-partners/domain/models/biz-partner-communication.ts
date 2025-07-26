import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { BizPartner } from "./biz-partner";

export enum BizPartnerCommunicationType {
    Mail = "Mail",
    Phone = "Phone"
}

export class BizPartnerCommunication extends EntityBase {
    readonly bizPartnerId!: string;

    @Type(() => BizPartner)
    readonly bizPartner!: BizPartner;

    communicationType!: BizPartnerCommunicationType;
    value!: string;

    constructor(bizPartner?: BizPartner) {
        super();

        if (bizPartner) {
            this.bizPartner = bizPartner;
            this.bizPartnerId = bizPartner.id;
        }
    }
}
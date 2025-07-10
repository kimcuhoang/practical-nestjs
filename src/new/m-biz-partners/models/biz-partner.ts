import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { ulid } from "ulidx";
import { BizPartnerLocation } from "./biz-partner-location";
import { BizPartnerCommunication } from "./biz-partner-communication";

export class BizPartner extends EntityBase {
    constructor(id?: string | null) {
        super(id ?? ulid());
        this.locations = [];
        this.communications = [];
    }
    
    bizPartnerKey: string;
    name: string;

    @Type(() => BizPartnerLocation)
    locations: BizPartnerLocation[];

    @Type(() => BizPartnerCommunication)
    communications: BizPartnerCommunication[];

    public addLocation(partial: Partial<BizPartnerLocation>): BizPartner {
        const location = new BizPartnerLocation(this);
        Object.assign(location, partial);
        this.locations.push(location);
        return this;
    }

    public addCommunication(partial: Partial<BizPartnerCommunication>): BizPartner {
        const communication = new BizPartnerCommunication(this, partial);
        this.communications.push(communication);
        return this;
    }
}
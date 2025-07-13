import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { ulid } from "ulidx";
import { BizPartnerLocation } from "./biz-partner-location";

export class BizPartner extends EntityBase {
    constructor() {
        super(ulid());
        this.locations = [];
    }
    
    bizPartnerKey: string;
    name: string;

    @Type(() => BizPartnerLocation)
    locations: BizPartnerLocation[];

    public addLocation(partial: Partial<BizPartnerLocation>): BizPartner {
        const location = new BizPartnerLocation(this);
        Object.assign(location, partial);
        this.locations.push(location);
        return this;
    }
}
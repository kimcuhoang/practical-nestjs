import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { ulid } from "ulidx";

export class BizPartner extends EntityBase {
    constructor(id?: string | null) {
        super(id ?? ulid());
    }
    
    bizPartnerKey: string;
    name: string;
}
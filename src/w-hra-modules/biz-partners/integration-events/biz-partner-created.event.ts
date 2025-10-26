import { IEvent } from "@nestjs/cqrs";
import { BizPartner } from "../domain";
import { BizPartnerPayload } from "../use-cases/commands";

export class BizPartnerCreated implements IEvent {
    bizPartner: BizPartner;
    payload: BizPartnerPayload;

    constructor(event: Partial<BizPartnerCreated>){
        Object.assign(this, event);
    }
}
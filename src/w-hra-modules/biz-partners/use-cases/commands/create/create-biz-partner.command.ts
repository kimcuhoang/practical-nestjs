import { ICommand } from "@nestjs/cqrs";
import { BizPartnerPayload } from "./payloads/biz-partner.payload";


export class CreateBizPartnerCommand implements ICommand {
    constructor(
        public readonly payload: BizPartnerPayload
    ){}
}
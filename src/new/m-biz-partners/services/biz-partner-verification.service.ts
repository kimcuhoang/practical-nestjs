import { Injectable } from "@nestjs/common";
import { BizPartner } from "../models";

export abstract class BaseBizPartnerVerificationService {
    abstract verifyWhenAdding(bizPartner: BizPartner): Promise<boolean>;
}

@Injectable()
export class BizPartnerVerificationService extends BaseBizPartnerVerificationService {
    public async verifyWhenAdding(bizPartner: BizPartner): Promise<boolean> {
        return Promise.resolve(true)
    }
}
import { BizPartner } from "../models";

export abstract class BaseBizPartnerVerificationService {
    abstract verifyWhenAdding(bizPartner: BizPartner): Promise<boolean>;
}

export class BizPartnerVerificationService extends BaseBizPartnerVerificationService {
    public override async verifyWhenAdding(bizPartner: BizPartner): Promise<boolean> {
        if (!bizPartner.bizPartnerKey) {
            throw new Error("BizPartnerKey is required");
        }
        return Promise.resolve(true)
    }
}
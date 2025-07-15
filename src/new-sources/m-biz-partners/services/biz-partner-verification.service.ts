import { BizPartner } from "../models";

export const IBizPartnerVerificationServiceSymbol = Symbol("IBizPartnerVerificationService");

export interface IBizPartnerVerificationService {
    verifyWhenAdding(bizPartner: BizPartner): Promise<boolean>;
}

export class BizPartnerVerificationService implements IBizPartnerVerificationService {
    public async verifyWhenAdding(bizPartner: BizPartner): Promise<boolean> {
        if (!bizPartner.bizPartnerKey) {
            throw new Error("BizPartnerKey is required");
        }
        return Promise.resolve(true)
    }
}
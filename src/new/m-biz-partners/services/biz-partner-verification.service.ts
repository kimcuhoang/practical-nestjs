import { BizPartner } from "../models";

export class BizPartnerVerificationService {
    public async verifyWhenAdding(bizPartner: BizPartner): Promise<boolean> {
        return Promise.resolve(true)
    }
}


export const BizPartnerVerificationServiceSymbol = Symbol(BizPartnerVerificationService.name);
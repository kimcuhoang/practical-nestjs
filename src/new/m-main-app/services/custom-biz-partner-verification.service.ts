import { BizPartner } from "@src/new/m-biz-partners/models/biz-partner";
import { BaseBizPartnerVerificationService } from "@src/new/m-biz-partners/services/biz-partner-verification.service";


export class CustomBizPartnerVerificationService extends BaseBizPartnerVerificationService {
    
    public async verifyWhenAdding(bizPartner: BizPartner): Promise<boolean> {
        const prefixes = await Promise.resolve([ "ABC", "DEF", "GHI" ]);
        return prefixes.some(prefix => bizPartner.bizPartnerKey.startsWith(prefix));
    }
}
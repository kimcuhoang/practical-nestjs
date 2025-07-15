import { BizPartner } from "@src/new-sources/m-biz-partners/models/biz-partner";
import { BizPartnerVerificationService } from "@src/new-sources/m-biz-partners/services/biz-partner-verification.service";


export class CustomBizPartnerVerificationService extends BizPartnerVerificationService {
    
    public override async verifyWhenAdding(bizPartner: BizPartner): Promise<boolean> {
        await super.verifyWhenAdding(bizPartner);
        const prefixes = await Promise.resolve([ "ABC", "DEF", "GHI" ]);
        return prefixes.some(prefix => bizPartner.bizPartnerKey.startsWith(prefix));
    }
}
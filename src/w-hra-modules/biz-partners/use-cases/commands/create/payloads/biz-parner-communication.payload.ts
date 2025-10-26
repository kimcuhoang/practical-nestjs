import { BizPartnerCommunicationType } from "@src/w-hra-modules/biz-partners/domain";
import { IsEnum } from "class-validator";

export class BizPartnerCommunicationPayload {
    @IsEnum(BizPartnerCommunicationType)
    communicationType!: BizPartnerCommunicationType;
    
    value!: string;
}
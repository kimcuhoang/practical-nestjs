import { IsArray, IsNotEmpty } from "class-validator";

export class BizPartnerCustomerPayload {
    code!: string;

    @IsArray()
    @IsNotEmpty()
    regions!: string[];
}
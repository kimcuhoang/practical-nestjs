import { IsArray, IsNotEmpty } from "class-validator";


export class BizPartnerVendorPayload {
    code!: string;
    shipmentVendorFlag!: boolean;

    @IsArray()
    @IsNotEmpty()
    regions!: string[];
}
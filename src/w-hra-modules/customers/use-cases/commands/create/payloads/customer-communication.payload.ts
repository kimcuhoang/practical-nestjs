import { CustomerCommunicationType } from "@src/w-hra-modules/customers/domain";
import { IsEnum } from "class-validator";


export class CustomerCommunicationPayload {
    
    @IsEnum(CustomerCommunicationType)
    type!: CustomerCommunicationType;

    value!: string;
}
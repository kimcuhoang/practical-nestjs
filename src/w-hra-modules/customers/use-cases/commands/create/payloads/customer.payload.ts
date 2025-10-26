import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { CustomerCommunicationPayload } from "./customer-communication.payload";
import { Type } from "class-transformer";

export class CustomerPayload {
    name!: string;
    code!: string;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CustomerCommunicationPayload)   
    communications!: CustomerCommunicationPayload[];

}
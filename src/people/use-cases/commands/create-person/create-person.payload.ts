import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class CreatePersonPayload {

    @Expose()
    @IsString()
    @ApiProperty({ type: String, required: true, name: "Name of person" })
    name: string;

}
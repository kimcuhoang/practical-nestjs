import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectPayload {
    @ApiProperty({type: String, example: 'Project Name'})
    name: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

class CreateProjectTaskPayload {
    @Expose()
    @IsString()
    @ApiProperty({ type: String, example: 'Task Name', required: true})
    taskName: string;
}

export class CreateProjectPayload {
    @Expose()
    @IsString()
    @ApiProperty({ type: String, example: 'Project Name', required: true })
    projectName: string;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({ type: String, example: 'Project Name', required: false })
    externalMessageId?: string;

    @Expose({ name: 'tasks'})
    @IsOptional()
    @ApiProperty({ type: [CreateProjectTaskPayload], example: [{ taskName: 'Task Name' }], required: false})
    tasks: CreateProjectTaskPayload[] = [];
}
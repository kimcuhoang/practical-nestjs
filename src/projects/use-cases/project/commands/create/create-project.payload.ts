import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsDate, isDate, IsOptional, IsString } from "class-validator";

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
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: Date, required: true })
    startDate: Date;

    @Expose({ name: 'tasks'})
    @IsOptional()
    @ApiProperty({ type: [CreateProjectTaskPayload], example: [{ taskName: 'Task Name' }], required: false})
    tasks: CreateProjectTaskPayload[] = [];
}
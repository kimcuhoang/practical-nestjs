import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

class CreateProjectTaskPayload {
    @Expose()
    @IsString({ message: 'validation.string'})
    @ApiProperty({ type: String, example: 'Task Name', required: true})
    taskName: string;
}

export class CreateProjectPayload {
    @Expose()
    @IsString({ message: i18nValidationMessage('validation.string' )})
    @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
    @ApiProperty({ type: String, example: 'Project Name', required: true })
    projectName: string;

    @Expose()
    @IsOptional()
    @IsString({ message: 'validation.string'})
    @ApiProperty({ type: String, example: 'Project Name', required: false })
    externalMessageId?: string;

    @Expose({ name: 'tasks'})
    @IsOptional()
    @ApiProperty({ type: [CreateProjectTaskPayload], example: [{ taskName: 'Task Name' }], required: false})
    tasks: CreateProjectTaskPayload[] = [];

    constructor(payload: Partial<CreateProjectPayload>) {
        Object.assign(this, payload);
    }
}
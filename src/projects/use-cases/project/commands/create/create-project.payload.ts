import { ApiProperty } from "@nestjs/swagger";
import { Project } from "@src/projects/core/project";

class CreateProjectTaskPayload {
    @ApiProperty({ type: String, example: 'Task Name' })
    name: string;
}

export class CreateProjectPayload {
    @ApiProperty({ type: String, example: 'Project Name' })
    name: string;
    @ApiProperty({ type: CreateProjectTaskPayload, isArray: true, example: [{ name: 'Task Name' }] })
    tasks: CreateProjectTaskPayload[] = [];
}
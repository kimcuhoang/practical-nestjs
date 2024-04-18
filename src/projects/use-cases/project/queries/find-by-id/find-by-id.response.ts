import { IQueryResult } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { Project } from "@src/projects/core/project";


export class FindByIdResponse implements IQueryResult {
    @ApiProperty({ type: String })
    id: string;
    @ApiProperty({ type: String })
    name: string;

    constructor(project: Project){
        this.id = project.id;
        this.name = project.name;
    }
}
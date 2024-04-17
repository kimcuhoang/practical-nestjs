import { IQueryResult } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { Project } from "src/project-management/models/project";

class SearchProjectResult {
    @ApiProperty({type: String, example: 'Project Id'})
    id: string;
    @ApiProperty({type: String, example: 'Project Name'})
    name: string;

    constructor(project: Project) {
        this.id = project.id;
        this.name = project.name;
    }
}

export class SearchProjectsResponse implements IQueryResult {
    @ApiProperty({type: [SearchProjectResult] })
    projects: SearchProjectResult[];
    @ApiProperty({type: Number})
    total: number;

    constructor(projects: Project[], total: number) {
        this.projects = projects.map(p => new SearchProjectResult(p));
        this.total = total;
    }
}
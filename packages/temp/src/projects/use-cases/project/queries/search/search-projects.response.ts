import { IQueryResult } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { Project, Task } from "@projects/core";


class TaskDto {
    @ApiProperty({type: String})
    id: string;
    @ApiProperty({type: String})
    name: string;

    constructor(task: Task) {
        this.id = task.id;
        this.name = task.name;
    }

}

export class ProjectDto {
    @ApiProperty({type: String, example: 'Project Id'})
    id: string;
    @ApiProperty({type: String, example: 'Project Name'})
    name: string;
    @ApiProperty({type: [TaskDto]})
    tasks: TaskDto[] = [];

    constructor(project: Project) {
        this.id = project.id;
        this.name = project.name;
        this.tasks = project.tasks.map(task => new TaskDto(task));
    }
}


export class SearchProjectsResponse implements IQueryResult {
    @ApiProperty({type: [ProjectDto] })
    projects: ProjectDto[];
    @ApiProperty({type: Number})
    total: number;

    constructor(projects: Project[], total: number) {
        this.projects = projects.map(p => new ProjectDto(p));
        this.total = total;
    }
}
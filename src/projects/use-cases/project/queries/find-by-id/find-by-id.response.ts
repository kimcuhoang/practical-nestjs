import { IQueryResult } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { Project } from "@src/projects/core/project";
import { Task } from "@src/projects/core/task";


class TaskDto {
    @ApiProperty({ type: String })
    id: string;
    @ApiProperty({ type: String })
    name: string;

    constructor(task: Task){
        this.id = task.id;
        this.name = task.name;
    }
}

export class FindByIdResponse implements IQueryResult {
    @ApiProperty({ type: String })
    id: string;
    @ApiProperty({ type: String })
    name: string;
    @ApiProperty({ type: [TaskDto] })
    tasks: TaskDto[] = [];

    constructor(project: Project){
        this.id = project.id;
        this.name = project.name;
        this.tasks = project.tasks.map(task => new TaskDto(task));
    }
}
import { EntityBase } from "@building-blocks/domains/entity-base";
import { Guid } from "guid-typescript";
import { Project } from "./project";


export class Task extends EntityBase {

    name: string;
    project: Project;
    projectId: string;

    constructor(id: string) {
        super(id);
    }

    public static create(project: Project, callback: (task: Task) => void) : Task {
        const task = new Task(Guid.create().toString());
        task.project = project;
        task.projectId = project.id;
        callback(task);
        return task;
    }
}
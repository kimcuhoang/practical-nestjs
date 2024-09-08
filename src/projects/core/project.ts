import { Guid } from "guid-typescript";
import { Task } from "./task";
import { EntityBase } from "@src/building-blocks/domains";

export class Project extends EntityBase {
    name: string;
    startDate: Date;
    tasks: Task[] = [];

    constructor(id: string) {
        super(id);
    }

    public static create(callback: (project: Project) => void) : Project {
        const project = new Project(Guid.create().toString());
        callback(project);
        return project;
    }

    public addTask(callback: (task: Task) => void) : Project {
        const task = Task.create(this, callback);
        this.tasks.push(task);
        return this;
    }
}
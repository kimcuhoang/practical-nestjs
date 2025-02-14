import { EntityBase } from "@building-blocks/domains/entity-base";
import { Task } from "./task";
import { ulid } from "ulidx";

export class Project extends EntityBase {
    name: string;
    externalMessageId: string | null;
    tasks: Task[] = [];

    constructor(id: string) {
        super(id);
    }

    public static create(callback: (project: Project) => void) : Project {
        const project = new Project(ulid());
        callback(project);
        return project;
    }

    public addTask(callback: (task: Task) => void) : Project {
        const task = Task.create(this, callback);
        this.tasks.push(task);
        return this;
    }
}
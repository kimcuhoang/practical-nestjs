import { EntityBase } from "@building-blocks/domains/entity-base";
import { Guid } from "guid-typescript";


export class Task extends EntityBase {

    name: string;

    constructor(id: string) {
        super(id);
    }

    public static create(callback: (task: Task) => void) : Task {
        const task = new Task(Guid.create().toString());
        callback(task);
        return task;
    }
}
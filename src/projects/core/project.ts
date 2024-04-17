import { Guid } from "guid-typescript";
import { EntityBase } from "../../building-blocks/domains/entity-base";

export class Project extends EntityBase {
    name: string;

    constructor(id: string) {
        super(id);
    }

    public static create(callback: (project: Project) => void) : Project {
        const project = new Project(Guid.create().toString());
        callback(project);
        return project;
    }
}
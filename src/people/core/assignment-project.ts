import { EntityBase } from "@src/building-blocks/domains/entity-base";


export class AssignmentProject extends EntityBase {

    name: string;

    constructor(id: string) {
        super(id);
    }

    public static create(id: string, callback: (p: AssignmentProject) => void) : AssignmentProject {
        const project = new AssignmentProject(id);
        callback(project);
        return project;
    }

}
import { EntityBase } from "@src/building-blocks/domains/entity-base";


export class AgileProject extends EntityBase {
    
    name: string;
    
    constructor(id: string) {
        super(id);
    };

    public static create(id: string, callback: (p: AgileProject) => void) : AgileProject {
        const project = new AgileProject(id);
        callback(project);
        return project;
    }
}
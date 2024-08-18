import { EntityBase } from "@src/building-blocks/domains/entity-base";


export class AgileProject extends EntityBase {
    
    name: string;
    
    constructor(id: string) {
        super(id);
    };
}
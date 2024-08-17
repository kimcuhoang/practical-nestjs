import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Guid } from "guid-typescript";


export class Person extends EntityBase {

    name: string;

    constructor(id: string) {
        super(id);
    }

    public static create(callback: (p: Person) => void): Person {
        const person = new Person(Guid.create().toString());
        callback(person);
        return person;
    }
}

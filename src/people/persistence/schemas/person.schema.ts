import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { Person } from "@src/people/core";
import { EntitySchema } from "typeorm";


export const PersonSchema = new EntitySchema<Person>({
    name: Person.name,
    columns: {
        ...EntityBaseSchema,
        name: {
            type: String,
            nullable: false,
            length: 200
        }
    }
});
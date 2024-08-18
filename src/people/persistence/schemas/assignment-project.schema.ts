import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { AssignmentProject } from "@src/people/core";
import { EntitySchema } from "typeorm";


export const AssignmentProjectSchema = new EntitySchema<AssignmentProject>({
    name: AssignmentProject.name,
    columns: {
        ...EntityBaseSchema,
        name: {
            type: String,
            nullable: false,
            length: 300
        }
    }
});
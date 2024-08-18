import { AgileProject } from "@src/agile-board/core";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { EntitySchema } from "typeorm";


export const AgileProjectSchema = new EntitySchema<AgileProject>({
    name: AgileProject.name,
    columns: {
        ...EntityBaseSchema,
        name: {
            type: String,
            nullable: false,
            length: 300
        }
    }
});
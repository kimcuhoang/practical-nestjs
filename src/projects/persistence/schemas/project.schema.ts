import { EntitySchema } from "typeorm";
import { Project } from "@projects/core/project";
import { EntityBaseSchema } from "@building-blocks/infra/database/schemas/entity-base-schema";

export const ProjectSchema = new EntitySchema<Project>({
    name: "Project",
    tableName: "Projects",
    columns: {
        ...EntityBaseSchema,
        name: {
            type: String,
            nullable: false
        }
    }
})
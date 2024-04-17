import { Project } from "../../core/project";
import { EntitySchema } from "typeorm";
import { EntityBaseSchema } from "../../../building-blocks/infra/database/schemas/entity-base-schema";


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
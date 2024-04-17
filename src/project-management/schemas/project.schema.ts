import { Project } from "src/project-management/models/project";
import { EntitySchema } from "typeorm";
import { EntityBaseSchema } from "./entity-base-schema";


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
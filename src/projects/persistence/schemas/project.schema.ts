import { EntitySchema } from "typeorm";
import { Project } from "@projects/core/project";
import { EntityBaseSchema } from "@building-blocks/infra/database/schemas/entity-base-schema";
import { TaskSchema } from "./task.schema";

export const ProjectSchema = new EntitySchema<Project>({
    name: "Project",
    columns: {
        ...EntityBaseSchema,
        name: {
            type: String,
            nullable: false
        },
    },
    relations: {
        tasks: {
            type: "one-to-many",
            target: () => TaskSchema.options.name,
            inverseSide: "Project",
            cascade: true,
            onDelete: "CASCADE"
        }
    }
})
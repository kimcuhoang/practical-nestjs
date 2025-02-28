import { EntitySchema } from "typeorm";
import { EntityBaseSchema } from "@building-blocks/infra/database/schemas/entity-base-schema";
import { Project, Task } from "@projects/core";


export const ProjectSchema = new EntitySchema<Project>({
    name: Project.name,
    columns: {
        ...EntityBaseSchema,
        name: {
            type: String,
            nullable: false
        },
        externalMessageId: {
            type: String,
            nullable: true
        }
    },
    relations: {
        tasks: {
            type: "one-to-many",
            target: Task.name,
            inverseSide: "project", // The `project` property from `Task` entity
            cascade: true,
            onDelete: "CASCADE"
        }
    }
})
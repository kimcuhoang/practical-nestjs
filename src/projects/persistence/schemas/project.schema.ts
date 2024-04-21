import { EntitySchema } from "typeorm";
import { Project } from "@projects/core/project";
import { EntityBaseSchema } from "@building-blocks/infra/database/schemas/entity-base-schema";
import { Task } from "@src/projects/core/task";
import { TaskSchema } from "./task.schema";

export const ProjectSchema = new EntitySchema<Project>({
    name: Project.name,
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
            target: Task.name,
            inverseSide: "project", // The `project` property from `Task` entity
            cascade: true,
            onDelete: "CASCADE"
        }
    }
})
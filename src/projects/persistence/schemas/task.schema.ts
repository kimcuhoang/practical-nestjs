
import { EntitySchema, EntitySchemaColumnOptions } from "typeorm";
import { ProjectSchema } from "./project.schema";
import { EntityBaseSchema } from "@building-blocks/infra/database/schemas/entity-base-schema";
import { Project, Task } from "@projects/core";

const columns = {
    name: {
        type: String,
        nullable: false
    } as EntitySchemaColumnOptions,
    projectId: {
        type: 'uuid',
        nullable: false,
        update: false
    } as EntitySchemaColumnOptions
}

export const TaskSchema = new EntitySchema<Task>({
    name: Task.name,
    columns: {
        ...EntityBaseSchema,
        ...columns
    },
    relations: {
        project: {
            type: "many-to-one",
            target: Project.name,
            inverseSide: "tasks", // The `tasks` property from `Project` entity
            joinColumn: {
                name: columns.projectId.name,
                referencedColumnName: ProjectSchema.options.columns.id.name,
                foreignKeyConstraintName: 'FK_Task_Project'
            },
            createForeignKeyConstraints: true,
            onDelete: "CASCADE"
        }
    }
});
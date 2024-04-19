import { Task } from "@projects/core/task";
import { EntityBaseSchema } from "@building-blocks/infra/database/schemas/entity-base-schema";
import { EntitySchema, EntitySchemaColumnOptions } from "typeorm";
import { ProjectSchema } from "./project.schema";

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
    name: "Task",
    columns: {
        ...EntityBaseSchema,
        ...columns
    },
    relations: {
        project: {
            type: "many-to-one",
            target: () => ProjectSchema.options.name,
            joinColumn: {
                name: columns.projectId.name,
                referencedColumnName: 'id',
                foreignKeyConstraintName: 'FK_Task_Project'
            },
            createForeignKeyConstraints: true,
            onDelete: "CASCADE"
        }
    }
});
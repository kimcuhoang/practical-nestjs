
import { ProjectSchema } from "./schemas/project.schema";
import { TaskSchema } from "./schemas/task.schema";

const Schemas = [
    ProjectSchema,
    TaskSchema
]

export const ProjectsModuleDataSource = {
    Schemas: Schemas
};
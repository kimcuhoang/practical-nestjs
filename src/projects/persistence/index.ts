
import { InitProject1713511054781 } from "./migrations/1713511054781-init-project";
import { InitTask1713519660187 } from "./migrations/1713519660187-init-task";
import { ProjectSchema } from "./schemas/project.schema";
import { TaskSchema } from "./schemas/task.schema";

const ProjectsModuleMigrations = [
    InitProject1713511054781,
    InitTask1713519660187
]

const Schemas = [
    ProjectSchema,
    TaskSchema
]

export const ProjectsModuleDataSource = {
    Schemas: Schemas,
    Migrations: ProjectsModuleMigrations
};

import { ProjectSchema } from "./schemas/project.schema";
import { TaskSchema } from "./schemas/task.schema";

const ProjectsModuleMigrations = [
    // InitProject1713511054781,
    // InitTask1713519660187,
    "dist/**/persistence/migrations/*.js"
]

const Schemas = [
    ProjectSchema,
    TaskSchema
]

export const ProjectsModuleDataSource = {
    Schemas: Schemas,
    Migrations: ProjectsModuleMigrations
};
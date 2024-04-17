import { Init1713379213286 } from "./migrations/1713379213286-init";
import { ProjectSchema } from "./schemas/project.schema";

const ProjectsModuleMigrations = [
    Init1713379213286
]

const Schemas = [
    ProjectSchema
]

export const ProjectsModuleDataSource = {
    Schemas: Schemas,
    Migrations: ProjectsModuleMigrations
};
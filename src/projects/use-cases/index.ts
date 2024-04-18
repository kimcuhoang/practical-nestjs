import { CreateProjectHandler } from "./project/commands/create/create-project.handler";
import { FindByIdHandler } from "./project/queries/find-by-id/find-by-id.handler";
import { SearchProjectsHandler } from "./project/queries/search/search-projects.handlers";


export const CommandHandlers = [
    CreateProjectHandler
]

export const QueryHandlers = [
    SearchProjectsHandler,
    FindByIdHandler
]
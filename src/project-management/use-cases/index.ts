import { CreateProjectHandler } from "./project/commands/create/create-project.handler";
import { SearchProjectsHandler } from "./project/queries/search/search-projects.handlers";


export const CommandHandlers = [
    CreateProjectHandler
]

export const QueryHandlers = [
    SearchProjectsHandler
]